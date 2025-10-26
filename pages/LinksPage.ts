import {Page, Locator, expect, test} from "@playwright/test";


class LinksPage {
    readonly page : Page;
    readonly linksHomeNewTab : Locator;
    readonly linksCreate : Locator; 
    readonly linksNoContent : Locator;
    readonly linksMoved : Locator;
    readonly linksBadRequest : Locator;
    readonly linksUnathorized : Locator;
    readonly linksForbidden : Locator;
    readonly linksNotFound: Locator;

    readonly linksArray : Array<{ name: string, locator: Locator, code: number, statusText: string}>
    readonly linksResponseString : Locator


    constructor(page: Page) {
        this.page = page;
        this.linksHomeNewTab = page.locator('#simpleLink');
        this.linksCreate = page.locator('#created');
        this.linksNoContent = page.locator('#no-content');
        this.linksMoved = page.locator('#moved');
        this.linksBadRequest = page.locator('#bad-request');
        this.linksUnathorized = page.locator('#unauthorized');
        this.linksForbidden = page.locator('#forbidden');
        this.linksNotFound = page.locator('#invalid-url');

        this.linksArray = [ 
            {name: "created", locator: this.linksCreate, code: 201, statusText : "Created"},
            {name: "no-content", locator: this.linksNoContent, code: 204, statusText: "No Content"},
            { name: "moved", locator: page.locator("#moved"), code: 301 , statusText: "Moved"},
            { name: "bad request", locator: page.locator("#bad-request"), code: 400, statusText: "Bad Request" },
            { name: "unauthorized", locator: page.locator("#unauthorized"), code: 401, statusText: "Unauthorized" },
            { name: "forbidden", locator: page.locator("#forbidden"), code: 403 , statusText: "Forbidden"},
            { name: "not found", locator: page.locator("#invalid-url"), code: 404, statusText: "Not Found"}
        ]

        this.linksResponseString = page.locator('#linkResponse');
    }


    //open new tab example where u have to wait for event -page
    async openNewTab() {
        const pagePromise = this.page.context().waitForEvent('page');
        await this.linksHomeNewTab.click();
        const openedPage = await pagePromise;
        
        //assert if redirection dela as expected
        //console.log("Base url " + openedPage.url());
        expect(openedPage.url()).toEqual("https://demoqa.com/");
        openedPage.close(); //cleanup
    }


    async checkSingleLinkStatus(code: number){
        const currentLink = this.linksArray.find(link => link.code === code);
        if (currentLink!== undefined) {
            return false;
        }
        const expectedStatusText = "Link has responded with staus " + code + " and status text " + currentLink.statusText;
        console.log("Expected status text: " + expectedStatusText);

        await currentLink.locator.click();
        await this.page.on('response', response => {
            expect(response.status()).toBe(currentLink.code);//check status code
        });
        await expect(this.linksResponseString).toHaveText(expectedStatusText); //check if response text is correct
    }

    async checkAllLinksStatus() {
        for (const link of this.linksArray) {
            await this.checkSingleLinkStatus(link.code);
        }
    }



}

export {LinksPage};

