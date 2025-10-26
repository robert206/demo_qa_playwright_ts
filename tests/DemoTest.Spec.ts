
import { test, expect } from '../fixtures/PageObjectFixtures'
import { Locator } from '@playwright/test';
import users from '../test_data/users.json';
import tableUsers from '../test_data/webTableUsersCheck.json';
import { link } from 'fs';
import { get } from 'http';
import { HomePage } from '../pages/HomePage';


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

  //click through all btns but check if they are not selected at first
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



