import {Page, Locator} from "@playwright/test";


class BookStoreApplication {
    readonly page: Page;

    readonly bookStoreLoginUrl : string = 'https://demoqa.com/login';
    readonly bookStoreRegisterUrl : string = 'https://demoqa.com/register';
    readonly bookStoreUrl : string = 'https://demoqa.com/books';
    readonly bookStoreProfileUrl : string = 'https://demoqa.com/profile';
    readonly bookStoreApiUrl : string = 'https://demoqa.com/swagger/';

    //login page
    readonly loginUsrName : Locator;
    readonly loginPasswd : Locator;
    readonly loginBtn : Locator;
    readonly newUserBtn : Locator;
    readonly loginInvalidMsg : Locator;

    //register page
    readonly registerFirstName : Locator;
    readonly registerLastName : Locator;
    readonly registerUserName : Locator;
    readonly registerPassword : Locator;
    readonly registerRegisterBtn : Locator;
    readonly registerBackToLoginBtn : Locator;


    constructor (page: Page) {
        this.page = page;
        //Login page
        this.loginUsrName = page.locator('#userName');
        this.loginPasswd = page.locator('#password');
        this.loginBtn = page.locator('#login');
        this.newUserBtn = page.locator('#newUser');
        this.loginInvalidMsg = page.locator('.error-message');

        //Register page
        this.registerFirstName = page.locator('#firstname');
        this.registerLastName = page.locator('#lastname');
        this.registerUserName = page.locator('#userName');
        this.registerPassword = page.locator('#password');
        this.registerRegisterBtn = page.locator('#register');
        this.registerBackToLoginBtn = page.locator('#gotologin');

        
    }


    async loginToBookStore ( username : string, password : string ) : Promise<void> {
        await this.loginUsrName.fill(username);
        await this.loginPasswd.fill(password);
        await this.loginBtn.click();
    }

    // **** todo : add register method ****

}
export {BookStoreApplication};