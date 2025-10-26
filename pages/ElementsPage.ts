import {Page, Locator,expect} from '@playwright/test'



class ElementsPage {
    readonly page : Page;
    readonly elementsHarmonicaBtn : Locator;
    readonly elementTextBox : Locator;
    readonly elementCheckBox : Locator;
    readonly elementRadioBtn : Locator;
    readonly elementWebTable : Locator;
    readonly elementButtons : Locator;
    readonly elementLinks : Locator;
    readonly elementBrokenLinks : Locator;
    readonly elementUploadDownload : Locator;
    readonly elementDynamicProperties : Locator;


    //TextBoxPage
    readonly elementsPageTitle : Locator;
    readonly fullName : Locator;
    readonly email : Locator;
    readonly currentAddress : Locator;
    readonly permanentAddress : Locator;
    readonly submitBtn : Locator;
    readonly outputName : Locator;
    readonly outputEmail : Locator;
    readonly outputCurrentAddress : Locator;
    readonly outputPermanentAddress : Locator;
    readonly invalidEmail : Locator;

    //CheckboxPage
    readonly checkBoxHeader : Locator;
    readonly checkBoxPlus : Locator;
    readonly checkBoxMinus : Locator;
    readonly rootCollapsed : Locator;
    readonly rootExpanded : Locator;

    //radioBtns page
    readonly radioYesBtn : Locator;
    readonly radioImpressiveBtn : Locator;
    readonly radioNoBtn : Locator;
    readonly radioSelectedText : Locator;


    //buttons page
    readonly dblClickBtn : Locator;
    readonly rightClickBtn : Locator;
    readonly clickBtn : Locator;
    readonly dblClickMsg : Locator;
    readonly rightClickMsg : Locator;
    readonly clickMsg : Locator;


    //download and upload page
    readonly uploadFileBtn: Locator;
    readonly downloadFileBtn: Locator;
    



    constructor(page: Page) {
        this.page = page;
        this.elementsHarmonicaBtn = page.locator('span.pr-1',{hasText : "Elements"});
        this.elementTextBox = page.locator('span.text', {hasText: "Text Box"});
        this.elementCheckBox = page.locator('span.text', {hasText: "Check Box"});
        this.elementRadioBtn = page.locator('span.text', {hasText: "Radio Button"});
        this.elementWebTable = page.locator('span.text', {hasText: "Web Tables"});
        this.elementButtons = page.locator('span.text', {hasText: "Buttons"});
        this.elementLinks = page.getByText('Links', { exact: true })
        this.elementUploadDownload = page.locator('span.text', {hasText: "Upload and Download"});

        this.elementsPageTitle = page.locator('h1.text-center');

        //TextBoxPage
        this.fullName = page.locator('#userName');
        this.email = page.locator('#userEmail');
        this.currentAddress = page.locator('#currentAddress');
        this.permanentAddress = page.locator('#permanentAddress');
        this.submitBtn = page.locator('#submit');
        this.outputName = page.locator('p#name');
        this.outputEmail = page.locator('p#email');
        this.outputCurrentAddress = page.locator('p#currentAddress');
        this.outputPermanentAddress = page.locator('p#permanentAddress');

        //invalid entry to email field locator
        this.invalidEmail = page.locator('#userEmail.mr-sm-2.field-error.form-control');

        //CheckBoxPage
        this.rootCollapsed = page.locator('li.rct-node.rct-node-parent.rct-node-collapsed')
        this.rootExpanded = page.locator('li.rct-node.rct-node-parent.rct-node-expanded');
        this.checkBoxPlus = page.locator('button.rct-option.rct-option-expand-all');
        this.checkBoxMinus = page.locator('rct-option-collapse-all');

        //Radio Btns page
        this.radioYesBtn = page.locator('#yesRadio');
        this.radioNoBtn = page.locator('#noRadio');
        this.radioImpressiveBtn = page.locator('#impressiveRadio');
        this.radioSelectedText = page.locator('span.text-success');

        //Buttons page
        this.dblClickBtn = page.locator('#doubleClickBtn');
        this.rightClickBtn = page.locator('#rightClickBtn');
        this.clickBtn = page.getByText("Click Me",{exact: true}); //dynamic id
        this.dblClickMsg = page.locator('#doubleClickMessage');
        this.rightClickMsg = page.locator('#rightClickMessage');
        this.clickMsg = page.locator('#dynamicClickMessage');

        //upload and download page
        this.uploadFileBtn = page.locator('#uploadFile');
        this.downloadFileBtn = page.locator('#downloadButton');
        
    }


    async fillTextField (textField : Locator, data :string) : Promise<void> {
        await textField.fill(data);
    }


    //download file t ogiven path
    async downloadFile(filePath: string): Promise<void> {
        await this.elementUploadDownload.click();
        expect(this.elementsPageTitle).toHaveText('Upload and Download');

        const downloadPromise = this.page.waitForEvent('download');
        await this.downloadFileBtn.click();
        const download = await downloadPromise;
        await download.saveAs(filePath);
        expect(download.suggestedFilename()).toEqual('sampleFile.jpeg');
    }

    async uploadFile(uploadBtn: Locator,filePath: string): Promise<void> {
        await uploadBtn.click();

        const uploadPromise = this.page.waitForEvent('filechooser');
        await uploadBtn.click();
        const fileChooser = await uploadPromise;
        await fileChooser.setFiles(filePath);
        const uploadedFilePath = await uploadBtn.inputValue();
        expect(uploadedFilePath).toContain('sampleFile.jpeg');
    }
    
}

export {ElementsPage};