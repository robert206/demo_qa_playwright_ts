import {Page, Locator, expect, Dialog} from '@playwright/test';


class AlertsFramesWindowsPages {

    readonly page: Page;
    
    //browser windows elements
    readonly browserWindowsCard : Locator;
    readonly browserWindowsTitle: Locator;
    readonly browserNewTab: Locator;
    readonly browserNewWin : Locator;
    readonly browserNewWinMsg : Locator;
    readonly newWinTabAddress: string = "https://demoqa.com/sample";


    //alerts 
    readonly alertsPageLink: Locator;
    readonly alertsPageBtn1 : Locator;
    readonly alertsPageBtn2 : Locator;
    readonly alertsPageConfirmBtn : Locator;
    readonly alertsPagePromptBtn : Locator;
    readonly alertsPageConfirmResult: Locator;
    readonly alertsPagePromptResult: Locator;


    constructor (page: Page) {
        this.page = page;
        //browser windows
        this.browserWindowsCard = page.getByText('Browser Windows',{exact: true});
        this.browserWindowsTitle = page.locator('h1.text-center');
        this.browserNewTab = page.locator('#tabButton');
        this.browserNewWin = page.locator('#windowButton');
        this.browserNewWinMsg = page.locator('#messageWindowButton');
        //alerts
        this.alertsPageLink = page.locator('span.text').filter({hasText:'Alerts'});
        this.alertsPageBtn1 = page.locator ('#alertButton');
        this.alertsPageBtn2 = page.locator ('#timerAlertButton');
        this.alertsPageConfirmBtn = page.locator ('#confirmButton');
        this.alertsPagePromptBtn = page.locator('#promtButton');
        this.alertsPageConfirmResult = page.locator('#confirmResult');
        this.alertsPagePromptResult = page.locator('#promptResult');
    }
    

    async openNewTabAndVerify() {
        //open tab ,promise listener but we only care for one, and that one is newTab promise so we can if opened
        const [newTab] = await Promise.all([
            this.page.context().waitForEvent('page'), //open listener
            await this.browserNewTab.click()  //click btn to open new shit
        ]);

        //switch to tab and check
        newTab.waitForLoadState("domcontentloaded");
        newTab.bringToFront();
        await expect(newTab).toHaveURL(this.newWinTabAddress);
        
        //text check on newly opened tab
        const tabContent = await newTab.locator("#sampleHeading").textContent();
        expect(tabContent?.trim()).toBe("This is a sample page");
        
        //close
        await newTab.close();
    }


    async openNewWindowAndVerify() {
        const [newWindow] = await Promise.all([
            this.page.context().waitForEvent('page'),
            await this.browserNewWin.click()
        ]);
        newWindow.waitForLoadState("domcontentloaded");
        newWindow.bringToFront();
        await expect(newWindow).toHaveURL(this.newWinTabAddress);

        const windowText = await newWindow.locator("#sampleHeading").textContent();
        expect(windowText?.trim()).toBe("This is a sample page");    
    }


    //open new window with message and verify its content
    async openNewWindowWithMsgAndVerify() {
        const [newWindowMsg] = await Promise.all([
            this.page.context().waitForEvent('page'),
            await this.browserNewWinMsg.click()
        ]);
        newWindowMsg.waitForLoadState("domcontentloaded");
        newWindowMsg.bringToFront();
        const newWindowMsgContent = await newWindowMsg.locator('body').textContent();
        expect (newWindowMsgContent?.trim()).toBe("Knowledge increases by sharing but not by saving. Please share this website with your friends and in your organization.");
    }

    
    async amIOnAlertsPage() {
        await expect (this.page).toHaveURL(/.*alerts*/);
    }



    //regular alert
    async clickAndVerifyAlert () : Promise<void> {
        this.page.waitForLoadState('domcontentloaded');
        //setup listener preden se klikne
        this.page.on('dialog', async (dialog: Dialog): Promise<void> => {
            expect(dialog.type()).toBe("alert");
            expect(dialog.message().trim()).toContain("You clicked a button");

            await dialog.accept(); //click ok 
        });
        //actual click on btn to trigger alert
        await this.alertsPageBtn1.click();
    }


    //delayed -doesnt really matter as listener waits for it so no need for .waitForElement or wait ..etc
    async clickAndVerifyDelayedAlert(): Promise<void> {
        await this.page.waitForLoadState('domcontentloaded');
        this.page.on('dialog', async (dialog: Dialog): Promise<void> => {
            expect(dialog.type()).toBe('alert');
            expect(dialog.message()).toContain("This alert appeared after 5 seconds");

            await dialog.accept(); //click on alert OK btn
        });
        await this.alertsPageBtn2.click();
    }


    //click and confirm alert
    async clickAndVerifyConfirmAlert(accept: boolean): Promise<void> {
        //await this.page.waitForEvent('dialog');
        await this.page.waitForLoadState('domcontentloaded');
        this.page.on('dialog', async (dialog: Dialog): Promise<void> => {
            expect(dialog.type()).toBe('confirm');
            expect(dialog.message()).toContain("Do you confirm action?");

            if (accept) {
                await dialog.accept();
                this.page.off('dialog', ()=> {});
            }
            else 
                await dialog.dismiss();
                this.page.off('dialog', ()=> {});
        });
        await this.alertsPageConfirmBtn.click();
        await expect(this.alertsPageConfirmResult).toContainText(accept ? "Ok" : "Cancel");
   }


   
    //prompt alert
    async clickAndVerifyPromptAlert(inputText: string): Promise<void> {
        await this.page.waitForLoadState("domcontentloaded");
        this.page.on('dialog', async (dialog: Dialog): Promise<void> => {
            expect(dialog.type()).toBe('prompt');
            expect(dialog.message()).toContain("Please enter your name");

            await dialog.accept(inputText); //input text and click ok
        });
        await this.alertsPagePromptBtn.click();
        await expect(this.alertsPagePromptResult).toContainText(inputText);
        this.page.off('dialog', async ()=> {});
    }

}

export {AlertsFramesWindowsPages};