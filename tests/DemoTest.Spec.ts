
import { test, expect } from '../fixtures/PageObjectFixtures'
import { Locator } from '@playwright/test';
import users from '../test_data/users.json';
import tableUsers from '../test_data/webTableUsersCheck.json';
import { link } from 'fs';
import { get } from 'http';
import { HomePage } from '../pages/HomePage';
import { strict } from 'assert';


test('Text Box input user data page', async ({ page, homePage, elementsPage }) => {
  homePage.clickCard(homePage.elementCard);
  const expectedUrl = "https://demoqa.com/elements";
  await expect(page).toHaveURL(expectedUrl);
  
  await elementsPage.elementTextBox.click();
  await expect(page).toHaveURL('https://demoqa.com/text-box');
  await expect(elementsPage.elementsPageTitle).toHaveText('Text Box');

  //fill all fields and submit-valid
  await elementsPage.fillTextField(elementsPage.fullName, users[0].name + " " + users[0].surname);
  await elementsPage.fillTextField(elementsPage.email, users[0].email);
  await elementsPage.fillTextField(elementsPage.currentAddress, users[0].address1);
  await elementsPage.fillTextField(elementsPage.permanentAddress, users[0].address2);
  await elementsPage.submitBtn.click();

  //assert result if fields are correctly submited
  await expect(elementsPage.outputName).toContainText(users[0].name + " " + users[0].surname);
  await expect(elementsPage.outputEmail).toContainText(users[0].email);
  await expect(elementsPage.outputCurrentAddress).toContainText(users[0].address1);
  await expect(elementsPage.outputPermanentAddress).toContainText(users[0].address2);

  //invalid input -email
  await elementsPage.fillTextField(elementsPage.email, "bogus email entry");
  await elementsPage.submitBtn.click();
  await expect(elementsPage.invalidEmail).toBeVisible();
});



test('Checkboxes directories', async ({page,homePage,elementsPage})=> {
  await homePage.clickCard(homePage.elementCard);
  await expect(page).toHaveURL('https://demoqa.com/elements');

  //go to checkbox page
  await elementsPage.elementCheckBox.click();
  await expect(page).toHaveURL('https://demoqa.com/checkbox');
  await expect(elementsPage.elementsPageTitle).toContainText('Check Box');

  //check if collapseg
  await expect(elementsPage.rootCollapsed).toBeVisible();
  //clicky on expand all plus btn
  await elementsPage.checkBoxPlus.click();
  await expect(elementsPage.rootExpanded).toHaveCount(6); //just count that there are 6 elements/dirs
  

});



test('Radio Btns selection test', async ({page,homePage,elementsPage})=> {
  await homePage.clickCard(homePage.elementCard);
  await expect(page).toHaveURL('https://demoqa.com/elements');

  //go to radio Btn page
  await elementsPage.elementRadioBtn.click();
  await expect(page).toHaveURL('https://demoqa.com/radio-button');
  await expect(elementsPage.elementsPageTitle).toContainText('Radio Button');

 
  //Yes btn
  await expect(elementsPage.radioYesBtn).not.toBeChecked();
  await elementsPage.radioYesBtn.check({force : true} );
  await expect(elementsPage.radioYesBtn).toBeChecked();
  await expect(elementsPage.radioSelectedText).toHaveText('Yes');
  // Impressive btn
  await expect(elementsPage.radioImpressiveBtn).not.toBeChecked();
  await elementsPage.radioImpressiveBtn.check({force:true});
  await expect(elementsPage.radioImpressiveBtn).toBeChecked();
  await expect(elementsPage.radioSelectedText).toHaveText('Impressive');
  //No btn check if it is disabled
  await expect(elementsPage.radioNoBtn).toBeDisabled();
});



test('Web Tables sort data', async ({page,homePage,elementsPage,webTablesPage})=> {
  await homePage.clickCard(homePage.elementCard);
  await expect(page).toHaveURL('https://demoqa.com/elements');

  //go to webTables page
  await elementsPage.elementWebTable.click();
  await expect(page).toHaveURL('https://demoqa.com/webtables');
  await expect(elementsPage.elementsPageTitle).toHaveText('Web Tables');

  // check headers text
  const headersCount: number  = await webTablesPage.webTableHeaders.count();
  expect(headersCount).toEqual(7);
  //console.log(headersCount);

  //traverse all header labels and check them
  const headersTextActual: string[] = await webTablesPage.webTableHeaders.allInnerTexts();
  const headersExpected = await webTablesPage.webTableHeadersLabel;
  expect(headersTextActual).toEqual(headersExpected);

  //check number of non-empty rows
  let vrstice: Locator[] = [];
  vrstice = await webTablesPage.getAllNonZeroRow();
  expect(vrstice).toHaveLength(3); //three are by default already there on fresh

  //compare all users entries in webTableUsers.json with actual ..it should be 1:1
  const users = await webTablesPage.getAllTableData();
  for (let i =0; i < vrstice.length;i++) {
    await webTablesPage.isUserOK(i,users[i]);
  } 

});


test('Web Tables Add and Remove users', async ({page,homePage,elementsPage,webTablesPage})=> {
  await homePage.clickCard(homePage.elementCard);
  await expect(page).toHaveURL('https://demoqa.com/elements');

  //go to webTables page
  await elementsPage.elementWebTable.click();
  await expect(page).toHaveURL('https://demoqa.com/webtables');
  await expect(elementsPage.elementsPageTitle).toHaveText('Web Tables');

  //save number of non-empty rows before adding
  let nonEmptyRowsBefore: Locator[] = [];
  nonEmptyRowsBefore = await webTablesPage.getAllNonZeroRow();
  expect(nonEmptyRowsBefore).toHaveLength(3); //three are by default already there on fresh

  //add user and check if properly added
  const newUser = await webTablesPage.registerNewUser();
  //console.log(newUser);
  let nonEmptyRowsAfter: Locator[] = [];
  nonEmptyRowsAfter = await webTablesPage.getAllNonZeroRow();
  expect(nonEmptyRowsBefore).not.toEqual(nonEmptyRowsAfter);

  //check if added-get all data from table
  let users = await webTablesPage.getAllTableData();
  const foundUserIndex: number = await webTablesPage.isUserFound(newUser,users) //returns index of found user in table or -1 if not
  if (foundUserIndex != -1) {
    await webTablesPage.isUserOK(foundUserIndex,newUser); //validate added user data
  }
  else console.log('User not found');

  //Remove newly added user
  await webTablesPage.webTableDeleteBtns.nth(foundUserIndex).click(); //click the one with correct index
  //check if removed
  users = await webTablesPage.getAllTableData();//fetch table data again
  expect(await webTablesPage.isUserFound(newUser,users)).toBe(-1); //check if user was removed ..-1 mans user is not found-thus OK

});


test('Web Tables-Edit User', async ({page,homePage,elementsPage,webTablesPage})=> {
  await homePage.clickCard(homePage.elementCard);
  await expect(page).toHaveURL('https://demoqa.com/elements');

  //go to webTables page
  await elementsPage.elementWebTable.click();
  await expect(page).toHaveURL('https://demoqa.com/webtables');
  await expect(elementsPage.elementsPageTitle).toHaveText('Web Tables');

  //save number of non-empty rows before adding
  let nonEmptyRowsBefore: Locator[] = [];
  nonEmptyRowsBefore = await webTablesPage.getAllNonZeroRow();
  expect(nonEmptyRowsBefore).toHaveLength(3); //three are by default already there on fresh

  //add new user and check if added correctly
  const newUser = await webTablesPage.registerNewUser();
  let users = await webTablesPage.getAllTableData();
  const foundUserIndex: number = await webTablesPage.isUserFound(newUser,users) //returns index of found user in table or -1 if not
  if (foundUserIndex != -1) {
    await webTablesPage.isUserOK(foundUserIndex,newUser); //validate added user data
  }
  else console.log('User not found');

  //edit user and submit changes to form
  await webTablesPage.editUser(foundUserIndex, "Robert", "Drekson", undefined, undefined, "5000");
  let usersAfterEdit = await webTablesPage.getAllTableData();
  await webTablesPage.webTableSearchBox.fill("Drekson");
  await webTablesPage.webTableSearchSubmitBtn.click();

});



test('Various Buttons ', async ({page,homePage,elementsPage})=> {
  await homePage.clickCard(homePage.elementCard);
  await expect(page).toHaveURL('https://demoqa.com/elements');
  
  await elementsPage.elementButtons.click();
  await expect(page).toHaveURL('https://demoqa.com/buttons');
  await expect(elementsPage.elementsPageTitle).toHaveText('Buttons');

  //dblclick
  await elementsPage.dblClickBtn.waitFor({state:"visible"});
  await elementsPage.dblClickBtn.dblclick({ button: "left" });
  await expect(elementsPage.dblClickMsg).toHaveText("You have done a double click");

  //right click btn
  await elementsPage.rightClickBtn.click({button: "right"});
  await expect(elementsPage.rightClickMsg).toHaveText("You have done a right click");
  
  //normal left click on dynamic id element
  await elementsPage.clickBtn.click();
  await expect(elementsPage.clickMsg).toHaveText("You have done a dynamic click");

});


test('Links page', async ({page,homePage, elementsPage,linksPage}) => {
  await homePage.clickCard(homePage.elementCard);
  await expect(page).toHaveURL('https://demoqa.com/elements');
  
  await elementsPage.elementLinks.click();
  await expect(page).toHaveURL("/links");
  await expect(elementsPage.elementsPageTitle).toHaveText('Links');

  await linksPage.openNewTab();
  await linksPage.checkAllLinksStatus();
});


test('Upload and Download files', async ({page,homePage,elementsPage})=> {
  await homePage.clickCard(homePage.elementCard);
  await expect(page).toHaveURL('https://demoqa.com/elements');

  await elementsPage.elementUploadDownload.click();
  await expect(page).toHaveURL('/upload-download');
  //await expect(elementsPage.elementsPageTitle).toHaveText('');

  //download file and save it to path given in test
  const filePath = "D:\\Repos\\demo_qa_playwright_ts\\test_data\\sampleFile.jpeg";
  await elementsPage.downloadFile(filePath);

  //upload file to given path
  await elementsPage.uploadFile(elementsPage.uploadFileBtn,filePath);

});


//practice forms with some random generating stuff
test('Practice Form with many diff elements-positive scenario', async ({page,homePage,practiceFormPage,elementsPage})=> {
  await homePage.clickCard(homePage.formsCard);
  await practiceFormPage.formsBtn.click()
  await expect(page).toHaveURL('https://demoqa.com/automation-practice-form');
  
  //populate form and get expected record for assertion later
  const expectedRecord : Record<string,string> = await practiceFormPage.populateForm();
  console.log("Expected record", expectedRecord);

  //upload picture on form
  const filePath = "D:\\Repos\\demo_qa_playwright_ts\\test_data\\sampleFile.jpeg";
  await elementsPage.uploadFile(practiceFormPage.uploadPictureInput,filePath);

  //actual Submit of data
  await practiceFormPage.submitForm(); 

  //assert  all fields entered 
  await practiceFormPage.assertFormSubmission(expectedRecord);  
  
});


test('Browser windows', async({page,homePage,alertsFramesWindowsPages})=> {
  await homePage.clickCard(homePage.alertsFrameWindowsCard);
  await expect(page).toHaveURL('https://demoqa.com/alertsWindows');

  // go to browser windpws page
  await alertsFramesWindowsPages.browserWindowsCard.click();
  await expect(page).toHaveURL('https://demoqa.com/browser-windows'); 

  //open new tab and verify
  await alertsFramesWindowsPages.openNewTabAndVerify();
  
  //open new window and verify
  await alertsFramesWindowsPages.openNewWindowAndVerify();

  await alertsFramesWindowsPages.openNewWindowWithMsgAndVerify();

});


test ('Alert -> Simple alert handling', async({page,homePage,alertsFramesWindowsPages})=> {
  await homePage.clickCard(homePage.alertsFrameWindowsCard);
  await expect(page).toHaveURL('https://demoqa.com/alertsWindows');

  // go to alerts page
  await alertsFramesWindowsPages.alertsPageLink.click();
  await expect(page).toHaveURL('https://demoqa.com/alerts');

 //simple alert
  await alertsFramesWindowsPages.clickAndVerifyAlert();


});

//Alert delayed 5s
test ('Alert -> Delayed 5s alert handling', async({page,homePage,alertsFramesWindowsPages})=> {
  await homePage.clickCard(homePage.alertsFrameWindowsCard);
  await expect(page).toHaveURL('https://demoqa.com/alertsWindows');

  // go to alerts page
  await alertsFramesWindowsPages.alertsPageLink.click();
  await expect(page).toHaveURL('https://demoqa.com/alerts');

 
  await alertsFramesWindowsPages.clickAndVerifyDelayedAlert();
});


//Alert confirm with OK or Cancel and evaluate result text
test ('Alert -> Confirm-> Yes /Cancel alert', async({page,homePage,alertsFramesWindowsPages})=> {
  await homePage.clickCard(homePage.alertsFrameWindowsCard);
  await expect(page).toHaveURL('https://demoqa.com/alertsWindows');

  // go to alerts page
  await alertsFramesWindowsPages.alertsPageLink.click();
  await expect(page).toHaveURL('https://demoqa.com/alerts');

  await alertsFramesWindowsPages.clickAndVerifyConfirmAlert(true); //Ok option 

  await alertsFramesWindowsPages.clickAndVerifyConfirmAlert(false); //Cancel 
});



//Alert prompt to enter text and assrt entered text in labels 
test ('Alert -> Prompt text box input', async({page,homePage,alertsFramesWindowsPages})=> {
  //navigate..
  await homePage.clickCard(homePage.alertsFrameWindowsCard);
  await expect(page).toHaveURL('https://demoqa.com/alertsWindows');

  // go to alerts page
  await alertsFramesWindowsPages.alertsPageLink.click();
  await expect(page).toHaveURL('https://demoqa.com/alerts');

  await alertsFramesWindowsPages.clickAndVerifyPromptAlert("Robert Leska");
});

//dela ko keks celo brez pucanja handlerja na listener ker playW popuce sam med instancami testov ,,paralleno ? preveri



test ('Accordians -> Accordian element basic tests', async({page,homePage,widgetsPage})=> {
  await homePage.clickCard(homePage.widgetsCard);
  await expect(page).toHaveURL(widgetsPage.widgetsUrl);

  //go to acordian page
  await widgetsPage.accordianCard.click();
  await expect(page).toHaveURL(widgetsPage.accordianUrl);
  await expect(widgetsPage.accordianPageTitle).toHaveText('Accordian');

  //accordian 1- laready expanded by default
  await widgetsPage.accordianCard1.click();
  await expect(widgetsPage.accordianText1).not.toBeVisible();
  await widgetsPage.accordianCard1.click();
  const text = await widgetsPage.accordianText1.textContent();
  await expect(widgetsPage.accordianText1).toBeVisible();

  //accordian 2
  await widgetsPage.accordianCard2.click();
  await expect(widgetsPage.accordianText2).toBeHidden();
  await widgetsPage.accordianCard2.click();
  const text2 = await widgetsPage.accordianText2.textContent();
  await expect(widgetsPage.accordianText2).toBeVisible();


});


test ('Auto complete -> Multiple and Single Selection', async( {page,homePage,widgetsPage}) => {
  await homePage.clickCard(homePage.widgetsCard);
  await expect(page).toHaveURL(widgetsPage.widgetsUrl);

  //go to auto complete page
  await widgetsPage.autoCompleteCard.click();
  await expect(page).toHaveURL(widgetsPage.autoCompleteUrl);
  
  //multiple color selection
  const expectedColors : string[] = ["Red","Green","Blue"];
  const colorsInput : string[] = ["Red","Gr","Blu"];
  await widgetsPage.fillMultiAutoCompleteColors(colorsInput);
  //await widgetsPage.assertInput (expectedColors);
  await widgetsPage.assertInputField(widgetsPage.autoCompleteMultiValues, expectedColors);

  //check count of Remove btns in input field->>>
  const removeBtnsCount = await widgetsPage.autoCompleteMultiValuesRemoveBtn.count();
  expect(removeBtnsCount).toBe(expectedColors.length);

  //singlecolor selection 
  const expectedSingleColor : string = "Green";
  const singleColorInput: string = "Gre";
  await widgetsPage.fillSingleAutoCompleteColor(singleColorInput);
  await widgetsPage.assertInputField(widgetsPage.autoCompleteSingleValue, expectedSingleColor);


  //**** we could write way more actual checks some also very stupid */
});


test ('Slider demo ', async ({page,homePage,widgetsPage}) => {
  await homePage.clickCard(homePage.widgetsCard);
  await expect(page).toHaveURL(widgetsPage.widgetsUrl);

  // go to sliders 
  await widgetsPage.sliderCard.click();
  await expect(page).toHaveURL('/slider');

  //lets drag
  const valueToDrag : string = '55';
  await widgetsPage.moveSlider(parseInt(valueToDrag));
  const currentValue = await widgetsPage.sliderCurrentValue.getAttribute('value');
  expect(currentValue).toEqual(parseInt(valueToDrag));

});



test ('Progress bar demo', async ({page,homePage,widgetsPage})=> {
  await homePage.clickCard(homePage.widgetsCard);
  await expect(page).toHaveURL(widgetsPage.widgetsUrl);

  await widgetsPage.progressBarCard.click();
  await expect(page).toHaveURL('/progress-bar');

  //check default if 0 before 
  let defaultValue = await widgetsPage.progressBar.getAttribute('aria-valuenow');
  expect(defaultValue).toBe('0');

  //start progres bar up to 100%
  let currentValue : string = await widgetsPage.startResetProgressBar('start');
  expect(currentValue).toBe('100');
  expect(widgetsPage.resetBtn).toBeVisible();

  //reset bar
  currentValue = await widgetsPage.startResetProgressBar('reset'); //should go back to 0 
  expect(currentValue).toBe('0');
  expect(widgetsPage.startStopBtn).toBeVisible();
});



test ('Tabs demo', async ({page,homePage,widgetsPage}) => {
  await homePage.clickCard(homePage.widgetsCard);
  await expect(page).toHaveURL(widgetsPage.widgetsUrl);
  
  await widgetsPage.tabsCard.click();
  await expect(page).toHaveURL(widgetsPage.tabsUrl);

  //check some tabs
  await widgetsPage.checkTab(widgetsPage.tabsWhat,widgetsPage.tabsContentWhat);
  await widgetsPage.checkTab(widgetsPage.tabsMore,widgetsPage.tabsContentMore);
  await widgetsPage.checkTab(widgetsPage.tabsOrigin,widgetsPage.tabsContentOrigin);
  await widgetsPage.checkTab(widgetsPage.tabsUse,widgetsPage.tabsContentUse);
});




test ('Tool Tips demo', async ({page,homePage,widgetsPage}) => {
  await homePage.clickCard(homePage.widgetsCard);
  await expect(page).toHaveURL(widgetsPage.widgetsUrl);
  
  await widgetsPage.toolTipCard.click();
  await expect(page).toHaveURL(widgetsPage.toolTipUrl);

  //first btn mouse over (hover tooltip)
  await widgetsPage.toolTipBtn.hover();
  const buttonToolTip : string = await widgetsPage.toolTipButtonField.textContent();
  expect(buttonToolTip).toBe('You hovered over the Button');

});



test('Menu items demo on hover', async({page,homePage,widgetsPage}) => {
  await homePage.clickCard(homePage.widgetsCard);
  await expect(page).toHaveURL(widgetsPage.widgetsUrl);

  await widgetsPage.menuCard.click();
  await expect(page).toHaveURL(widgetsPage.menuUrl);

  const item2 = page.getByText('Main Item 2', {exact : true});
  await item2.hover();
  const subsubList = page.getByText('SUB SUB LIST »',{exact: true});
  expect(subsubList).toBeVisible();
});



test ('Select menu different dropdowns and select windows', async ({page,homePage,widgetsPage}) => {
  await homePage.clickCard(homePage.widgetsCard);
  await expect(page).toHaveURL(widgetsPage.widgetsUrl);

  //navigate to ..
  await widgetsPage.selectMenuCard.click();
  expect(page).toHaveURL(widgetsPage.selectMenuUrl);

  //select value -top dropdown react j s 
  await widgetsPage.selectValue.click();
  const option = page.getByText('Group 1, option 1',{exact: true});
  await option.click();
  const allTexts = await widgetsPage.selectValue.textContent();
  expect(allTexts).toContain('Group 1, option 1, selected');

  //select one 
  await widgetsPage.selectOne.click();
  const selectOne =  page.getByText('Mrs.',{exact : true});
  await selectOne.click();
  const txtOne = await widgetsPage.selectOne.textContent();
  expect(txtOne).toContain('Mrs.');


  //classic Select menu already bultin playwright
  expect (widgetsPage.selectOldStyle).toHaveValue('red'); //default

  await widgetsPage.selectOldStyle.selectOption('Green');
  // expect(widgetsPage.selectOldStyle).toHaveValue('Green');//this will fail as actual value= "1 " so we must check text
  const selectedColor = await widgetsPage.selectOldStyle.locator('option:checked').innerText();
  expect(selectedColor).toBe('Green');
});



test ('Date picker demo', async ({page,homePage,widgetsPage})=> {
  await homePage.clickCard(homePage.widgetsCard);
  await expect(page).toHaveURL(widgetsPage.widgetsUrl);

  //go to date picker page
  await widgetsPage.datePickerCard.click();
  await expect(page).toHaveURL(widgetsPage.datePickerUrl);

  //fill date and time
  //await widgetsPage.datePickerDate.click();
  await widgetsPage.datePickerDate.fill('01/01/2026');
  await expect(widgetsPage.datePickerDate).toHaveValue('01/01/2026');
  
 // etc ... non fill method is more tedious but its ok for practice i will skip it anyway as i believe 
 // other stuff is more important
 
});


test ('Interactions -> Sortable drag & drop items in list', async ({page,homePage,interactionsPage})=> {

  await homePage.clickCard(homePage.interactionsCard);
  await interactionsPage.sortableCard.click();
  await expect(page).toHaveURL('https://demoqa.com/sortable');
  await interactionsPage.sortableTabList.click();
  //check if tab LIst is selected
  expect(interactionsPage.sortableTabList).toHaveAttribute('aria-selected', 'true');
  
  //drag and drop item from position 1 to position 5 and check if move was OK 
  let allItemsBefore: string[] = await interactionsPage.sortableList.allTextContents();
  await interactionsPage.dragDropListItem('One','Five');

  //assert if moved
  let allItemsAfter: string[] = await interactionsPage.sortableList.allTextContents();
  //console.log("After drag drop:", allItemsAfter);
  expect(allItemsBefore[0]).toBe(allItemsAfter[4]);

  //drag and drop by index item [2] to item [3] -"three to four" example
  allItemsBefore = await interactionsPage.sortableList.allTextContents();
  await interactionsPage.dragDropListItemByIndex(2,3);
  allItemsAfter = await interactionsPage.sortableList.allTextContents();
  expect(allItemsBefore[2]).toBe(allItemsAfter[3]);

  //some random drag and drop of items in list and assertion afterwards
  for (let i =0; i < 10; i++) {
    let allItemsBefore : string[] = await interactionsPage.sortableList.allTextContents();
    //drag drop and save indexes for assertion
    let indeksi : [ number, number] = await interactionsPage.dragDropItemListRandomly(interactionsPage.sortableList);
    //console.log("Dragged items index: ", indeksi);
    let allItemsAfter: string[] = await interactionsPage.sortableList.allTextContents();
    expect(allItemsBefore[indeksi[0]]).toBe(allItemsAfter[indeksi[1]]); 
  }
});



test ('Interactions -> Sortable drag&drop in grid list example', async ({page,homePage, interactionsPage}) => {
  await homePage.clickCard(homePage.interactionsCard);
  await interactionsPage.sortableCard.click();
  await expect(page).toHaveURL('https://demoqa.com/sortable');
  //switch to Grid Tab
  await interactionsPage.sortableGridTab.click();
  //check grid tab is displayed
  expect(interactionsPage.sortableGridTab).toHaveAttribute('aria-selected','true');
  
  // some random drag and drop in grid list diff tab
  for (const i of Array(10).keys()) {
    let allItemsBefore : string[] = await interactionsPage.sortableGrid.allTextContents();
    //drag drop and save indexes for assertion
    let indeksi : [ number, number] = await interactionsPage.dragDropItemListRandomly(interactionsPage.sortableGrid);
    //console.log("Dragged items index: ", indeksi);
    let allItemsAfter: string[] = await interactionsPage.sortableGrid.allTextContents();
    expect(allItemsBefore[indeksi[0]]).toBe(allItemsAfter[indeksi[1]]);
  }

});


test ('Interactions -> Selectable -> Select items from list', async ({page,homePage,interactionsPage})=> {
  await homePage.clickCard(homePage.interactionsCard);
  await interactionsPage.selectableCard.click();
  await expect(page).toHaveURL('https://demoqa.com/selectable');
  await interactionsPage.selectableTabList.click();
  // check if tab LIst is selected
  expect(interactionsPage.selectableTabList).toHaveAttribute('aria-selected', 'true');

  // select some items from list and check if selected -one by one ..select unselect
  for (const i of Array(5).keys()) {
    let randomIndex = Math.floor(Math.random() * await interactionsPage.selectableList.count());

    await interactionsPage.selectItemByIndex(interactionsPage.selectableList, randomIndex); //select 
    //get selected item text and compare with expected
    let itemTextSelected = await interactionsPage.selectableList.nth(randomIndex).textContent();
    // there is not attribute or similar so to check using class .active that is added to selected item
    let expectedItemText = await page.locator('li.mt-2.list-group-item.active.list-group-item-action').textContent();

    expect(itemTextSelected).toEqual(expectedItemText); //clumsy but works

    await interactionsPage.selectableList.nth(randomIndex).click(); //unselect
  }
  
});









