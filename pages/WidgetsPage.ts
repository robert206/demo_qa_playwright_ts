import {Page, Locator, expect} from '@playwright/test';

class WidgetsPage {

    readonly page: Page;

    //accordian
    readonly widgetsUrl : string = "/widgets";
    readonly accordianCard : Locator;
    readonly accordianUrl : string = "/accordian";
    readonly accordianPageTitle : Locator;
    readonly accordianCard1 : Locator;
    readonly accordianCard2 : Locator;
    readonly accordianCard3 : Locator;
    readonly accordianText1 : Locator;
    readonly accordianText2 : Locator;
    readonly accordianText3 : Locator;

    //Auto Complete
    readonly autoCompleteCard : Locator;
    readonly autoCompleteUrl : string;
    readonly autoCompleteTitle: Locator;
    readonly autoCompleteMultipleInput : Locator;
    readonly autoCompleteSingleInput : Locator;
    readonly autoCompleteSingleValue: Locator;
    readonly autoCompleteMultiValues : Locator;
    readonly autoCompleteMultiValuesRemoveBtn : Locator;
    readonly autoCompleteColorOptions: Locator; // list of all autocomplete suggestons 

    //Slider
    readonly sliderCard : Locator;
    readonly sliderTitle : Locator;
    readonly sliderSlider : Locator;
    readonly sliderCurrentValue : Locator;

    //Progress bar
    readonly progressBarCard : Locator;
    readonly progressBar : Locator;
    readonly startStopBtn : Locator;
    readonly resetBtn : Locator;

    //Tabs
    readonly tabsUrl = "/tabs";
    readonly tabsCard: Locator;
    readonly tabsWhat : Locator;
    readonly tabsOrigin : Locator;
    readonly tabsUse : Locator;
    readonly tabsMore : Locator;
    readonly tabsContentWhat : Locator;
    readonly tabsContentOrigin :Locator;
    readonly tabsContentUse : Locator;
    readonly tabsContentMore : Locator;//hidden


    //Tooltips
    readonly toolTipUrl = '/tool-tips';
    readonly toolTipCard : Locator;
    readonly toolTipBtn : Locator;
    readonly toolTipField : Locator;
    readonly toolTipButtonField : Locator;
    readonly toolTipTextField : Locator;

    //Menu
    readonly menuUrl : string = '/menu';
    readonly menuCard : Locator;

    //Select Menu 
    readonly selectMenuUrl : string = '/select-menu';
    readonly selectMenuCard : Locator;
    readonly selectMenuTitle : Locator;
    readonly selectValue : Locator;
    readonly selectOne : Locator;
    readonly selectOldStyle : Locator;
    readonly multiSelectDropDown : Locator;
    readonly standardMultiSelect : Locator;


    //date picker
    readonly datePickerCard : Locator;
    readonly datePickerUrl : string = '/date-picker';
    readonly datePickerDate : Locator;
    readonly datePickerDateAndTime : Locator;


    constructor (page :Page) {
        this.page = page;

        //harmonica
        this.accordianCard = page.getByText('Accordian', {exact : true});
        this.accordianPageTitle = page.locator('#accordianContainer>h1.text-center');
        this.accordianCard1 = page.locator('#section1Heading');
        this.accordianCard2 = page.locator('#section2Heading');
        this.accordianCard3 = page.locator('#section3Heading');
        this.accordianText1= page.locator('#section1Content p');
        this.accordianText2 = page.locator('#section2Content p');
        this.accordianText3 = page.locator('#section3Content p');

        //Auto complete
        this.autoCompleteCard = page.locator('span.text').filter({hasText: 'Auto Complete'});
        this.autoCompleteTitle = page.locator('#autoCompleteContainer > h1.text-center');
        this.autoCompleteUrl = "/auto-complete";
        this.autoCompleteMultipleInput = page.locator('#autoCompleteMultipleInput');
        this.autoCompleteSingleInput = page.locator('#autoCompleteSingleInput');
        this.autoCompleteSingleValue = page.locator('.auto-complete__single-value'); //value entered
        this.autoCompleteMultiValues = page.locator('.auto-complete__multi-value');//values entered
        this.autoCompleteMultiValuesRemoveBtn = page.locator('.auto-complete__multi-value__remove > svg'); //remove btns for values above
        this.autoCompleteColorOptions = page.locator('.auto-complete__option'); // list of all autocomplete suggestions


        //Slider
        this.sliderCard = page.locator('span.text').filter({hasText: 'Slider'});
        this.sliderTitle = page.locator('h1.text-center').filter( {hasText: 'Slider'});
        this.sliderSlider = page.locator(".range-slider__wrap");
        this.sliderCurrentValue = page.locator('#sliderValue');


        //Progress bar
        this.progressBarCard = page.locator('span.text').filter({hasText: 'Progress Bar'});
        this.progressBar = page.getByRole('progressbar');
        this.startStopBtn = page.locator('#startStopButton');
        this.resetBtn = page.locator('#resetButton');

        //Tabs
        this.tabsCard = page.locator('span.text').filter({hasText : 'Tabs'});
        this.tabsWhat = page.locator('#demo-tab-what');
        this.tabsOrigin = page.locator('#demo-tab-origin');
        this.tabsUse = page.locator('#demo-tab-use');
        this.tabsMore = page.locator('#demo-tab-more');
        this.tabsContentWhat = page.locator('#demo-tabpane-what');
        this.tabsContentOrigin = page.locator('#demo-tabpane-origin');
        this.tabsContentUse = page.locator('#demo-tabpane-use');
        this.tabsContentMore = page.locator('#demo-tabpane-more');

        //Tooltips
        this.toolTipCard = page.locator('span.text').filter({hasText: 'Tool Tips'});
        this.toolTipBtn = page.locator('#toolTipButton');
        this.toolTipField = page.locator('#toolTipTextField');
        this.toolTipButtonField = page.locator('#buttonToolTip');
        this.toolTipTextField = page.locator('#toolTipTextField');
        
        //Menu
        this.menuCard = page.getByText('Menu', { exact: true });

        //Select Menu
        this.selectMenuCard = page.getByText('Select Menu', {exact :true});
        this.selectMenuTitle = page.locator ('h1.text-center',{hasText : 'Select Menu'});
        this.selectValue = page.locator('#withOptGroup');
        this.selectOne = page.locator('#selectOne');
        this.selectOldStyle = page.locator('#oldSelectMenu');
        this.multiSelectDropDown = page.locator('#react-select-4-input');
        this.standardMultiSelect = page.locator('#cars');

        //Date picker
        this.datePickerCard = page.getByText('Date Picker',{exact:true});
        this.datePickerDate = page.locator('#datePickerMonthYearInput');
        this.datePickerDateAndTime = page.locator('#dateAndTimePickerInput');
      
    }


    //,multiple color selection given by a list of strings
    async fillMultiAutoCompleteColors(colors: string[]): Promise<void> {
        for (const color of colors) {
            await this.autoCompleteMultipleInput.fill(color);
            await this.autoCompleteColorOptions.filter({hasText : color}).first().click();
        }
    }


    //single color input
    async fillSingleAutoCompleteColor(color : string): Promise<void> {
        await this.autoCompleteSingleInput.fill(color);
        await this.autoCompleteSingleInput.press('ArrowDown');
        await this.autoCompleteSingleInput.press('Enter');
        //await this.autoCompleteSingleValue.filter({hasText : color}).first().click();
    }

    //positive flow --otherwise it should fail and this function is obsolete as 
    async checkTab(tab : Locator, tabContent: Locator) : Promise<void> {
        //if its not disabled
        if (!await tab.getAttribute('aria-disabled')) {
            await tab.click();
            expect(tabContent).toBeVisible();
        }
        //it is disabled then you cant click it and cannot 
        else {
            console.log('tab is disabled=> ' + tab);
        }
    }


    //lets try a universal function for input fields content assertaxtion just for the shits
    async assertInputField(elementLocator : Locator, expectedValues: string[] | string):Promise<void> {
        if (Array.isArray(expectedValues)) {
            const actualValues = await elementLocator.allTextContents();
            for (const value of expectedValues) {
                expect(actualValues).toContain(value);
            }
        }
        else {
            await elementLocator.waitFor({state: 'visible'});
            const actualText = await elementLocator.textContent();
            expect(actualText).toContain(expectedValues);
        }
    }



    //Serenity now
    async moveSlider(targetValue: number) {
    
        //builtin thingie so now we can give him mouse commands etc..
        const sliderBox = await this.sliderSlider.boundingBox();

        const min = 0;
        const max = 100;
        const percent =  (targetValue - min) / (max - min);
        const targetX =  sliderBox.x + (sliderBox.width * percent);
        
        //move mouse over the slider
        await this.page.mouse.move(sliderBox.x + sliderBox.width / 2, sliderBox.y + sliderBox.height/2);
        //left click drag will be performed by click down left btn and then move position along X until it reaches the target value
        await this.page.mouse.down();
        await this.page.mouse.move(targetX, sliderBox.y + sliderBox.height / 2);
        await this.page.mouse.up();

        //check if its done after every iteration
        let currentValue :string = await this.sliderCurrentValue.getAttribute('value');
        console.log('Current value :' + currentValue);

    }

    
    //start or reset progress bar nice and cleaaan
    async startResetProgressBar (operation : 'start' | 'reset') : Promise<string> {
        switch (operation) {
            case 'start':
                if (this.startStopBtn.isVisible()) {
                    await this.startStopBtn.click();
                    await this.resetBtn.waitFor({state: 'visible'});
                }
                break;
            case 'reset':
                if (this.resetBtn.isVisible()) {
                    await this.resetBtn.click();
                    await this.startStopBtn.waitFor({state:'visible'});
                }
                break;
            }
        const currValue :string = await this.progressBar.getAttribute('aria-valuenow');
        return currValue;
    }







    


}
export {WidgetsPage};
