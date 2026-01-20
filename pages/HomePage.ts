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
        this.widgetsCard = page.getByText('Widgets', {exact : true});
        this.interactionsCard = page.getByText ('Interactions', {exact : true});
        this.bookStoreCard = page.getByText ('Book Store Application', {exact : true});

    }

    async clickCard (card : Locator) {
        await card.click();
    }

}

export {HomePage};


