import {Page, Locator, expect} from '@playwright/test'


class HomePage {
    readonly page : Page;
    readonly elementCard : Locator;
    readonly formsCard : Locator;
    readonly alertsFrameWindowsCard : Locator;
    readonly widgetsCard : Locator;
    readonly interactionsCard : Locator;
    readonly bookStoreCard : Locator;

    
    constructor (page : Page) {
        this.page = page;
        this.elementCard = page.getByText ('Elements', {exact: true} );
        this.formsCard = page.getByText ('Forms', {exact : true});
        this.alertsFrameWindowsCard = page.locator ("//div[@class='card-body']//h5[text()='Alerts, Frame & Windows']");

    }

    async clickCard (card : Locator) {
        await card.click();
    }

}

export {HomePage};


