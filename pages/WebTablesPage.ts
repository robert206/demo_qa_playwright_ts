import {Page, Locator,expect} from '@playwright/test'
import tableUsers from '../test_data/webTableUsersCheck.json';


type User = {
    firstName: string,
    lastName: string,
    age: string,
    email: string,
    salary: string,
    department: string
}

class WebTablesPage {
   
    readonly page : Page;
    readonly webTableAddRecord : Locator;
    readonly webTableSearchBox : Locator;
    readonly webTableSearchSubmitBtn : Locator;
    readonly webTablePageSelector : Locator;
    readonly webTableRowSelector : Locator;
    readonly webTableHeaders : Locator;
    readonly webTableHeadersLabel = [
    'First Name',
    'Last Name',
    'Age',
    'Email',
    'Salary',
    'Department',
    'Action'
    ];

    readonly webTableAllRows : Locator;
    readonly webTableDeleteBtns : Locator;
    readonly webTableEditBtns : Locator;

    //registration form
    readonly rformTitle: Locator;
    readonly rformFirstName: Locator;
    readonly rformLastName: Locator;
    readonly rformEmail: Locator;
    readonly rformAge: Locator;
    readonly rformSalary: Locator;
    readonly rformDepartment: Locator;
    readonly rformSubmit: Locator;
    readonly rformCloseBtn: Locator;




    constructor (page : Page) {
        this.page = page;
        this.webTableAddRecord = page.locator('#addNewRecordButton');
        this.webTableSearchBox = page.locator('#searchBox');
        this.webTableSearchSubmitBtn = page.locator('#basic-addon2');
        this.webTablePageSelector = page.locator('input[type="number"]');
        this.webTableRowSelector = page.getByLabel('rows per page');
        this.webTableHeaders = page.locator('div.rt-th'); // top headers
        //all rows 
        this.webTableAllRows = page.getByRole('row');
        //all delete btns
        this.webTableDeleteBtns = page.locator('span[title="Delete"]');
        this.webTableEditBtns = page.locator('span[title="Edit"]');


        //registration form
        this.rformTitle = page.locator('#registration-form-modal')
        this.rformFirstName = page.locator('#firstName');
        this.rformLastName = page.locator('#lastName');
        this.rformEmail = page.locator('#userEmail');
        this.rformAge = page.locator('#age');
        this.rformSalary = page.locator('#salary');
        this.rformDepartment = page.locator('#department');
        this.rformSubmit = page.locator('#submit');
        this.rformCloseBtn = page.locator('button[type="button"].close');
    }


    //returns list of locators which are 
    async getAllNonZeroRow(): Promise<Locator[]> {
        let nonZeroRows: Locator[]= [];

        await this.page.waitForSelector('.rt-table')
        const allTableRows = await this.page.locator('.rt-tr-group').all();// list of locators 

        //filter list of locators ,only non empty rows of tables are returned
        for (let row of allTableRows) {
            const nonEmpty= await row.locator('div.rt-td').filter({ hasText: /\S/ }).count() > 0;
            if (nonEmpty) {
                nonZeroRows.push(row);
            }
        }
        return nonZeroRows;//!
    }


    async getAllTableData():Promise<any[]> {
        const nonEmptyRows = await this.getAllNonZeroRow();
        //console.log(nonEmptyRows);
        const dataTable = [];

        for (let i = 0; i < nonEmptyRows.length;i++) {
            const row = nonEmptyRows[i];
            let cell: string[] = await row.locator('div.rt-td').allInnerTexts(); //get current row all text
            const trimmedCells = cell.map(cell => cell.trim());
            dataTable.push( {
                firstName: trimmedCells[0],
                lastName: trimmedCells[1],
                age: trimmedCells[2],
                email: trimmedCells[3],
                salary: trimmedCells[4],
                department: trimmedCells[5]
            })
        }
        
        return dataTable;
    }


    async isUserOK( rowIndex: number, user: User) {
        let nonZeroRows: Locator[] = []; 
        nonZeroRows = await this.getAllNonZeroRow(); //list of locators of non-empty lines
        //console.log(nonZeroRows);

        const targetRow = await nonZeroRows[rowIndex].locator('div.rt-td').allInnerTexts();
        let trimmed : string[] = [];
        trimmed = targetRow.map(cell => cell.trim()); //save to list of of all cells in table row
        //console.log(trimmed);
        const isFirstNameMatch = trimmed[0] === user.firstName;
        const isLastNameMatch = trimmed[1] === user.lastName;
        const isAgeMatch = trimmed[2] === user.age;
        const isEmailMatch = trimmed[3] === user.email;
        const isSalaryMatch = trimmed[4] === user.salary;
        const isDepartmentMatch = trimmed[5] === user.department

        expect(isFirstNameMatch).toBeTruthy();
        expect(isLastNameMatch).toBeTruthy();
        expect(isAgeMatch).toBeTruthy();
        expect(isEmailMatch).toBeTruthy();
        expect(isSalaryMatch).toBeTruthy();
        expect(isDepartmentMatch).toBeTruthy();
    }


    //founds user and returns its index in the table of all data retrieved from table
    async isUserFound(user: User, users: User[]): Promise<number> {
        for (let i = 0; i < users.length;i++) {
            if (users[i].email === user.email) {
                return i;
            }
        }
        return -1;
    }


   // generate random user json string
    async generateRandomUser(): Promise<User> {
        const firstNames = ["Mirko", "Radirko", "Joseph", "Emma", "Drek", "Janez"];
        const lastNames = ["Radic", "Johnson", "Drekson", "Fargo", "Gaga", "Grapa", "Zirko", "Goba", "Klobasa", "Rolada"];
        const departments = ["Engineering", "Konjar", "Prodaja", "Izdaja", "Financar", "Operations", "RND"];
  
        //all the random goodies
        const firstName = firstNames[Math.floor(Math.random() * firstNames.length)];
        const lastName = lastNames[Math.floor(Math.random() * lastNames.length)];
        const age = (Math.floor(Math.random() * 20) + 25).toString();
        const salary = (Math.floor(Math.random() * 50000) + 140000).toString();
        const department = departments[Math.floor(Math.random() * departments.length)];
        const email = firstName.toLowerCase() + "." + lastName.toLowerCase() + "@test.com";

        return { firstName, lastName, age, email, salary, department };
    }

    // add new random user to table
    async registerNewUser() :Promise<User> {
        //open register user dialog first
        await this.webTableAddRecord.click(); 
        const registrationFormModal = this.page.locator('#registration-form-modal');
        await registrationFormModal.waitFor({state:"visible"});
        await expect(registrationFormModal).toHaveText('Registration Form'); //check if registr.form is opened

        const newRandomUser = await this.generateRandomUser();

        //fill all fields with new random user Data
        await this.rformFirstName.fill(newRandomUser.firstName);
        await this.rformLastName.fill(newRandomUser.lastName);
        await this.rformEmail.fill(newRandomUser.email);
        await this.rformAge.fill(newRandomUser.age);
        await this.rformSalary.fill(newRandomUser.salary);
        await this.rformDepartment.fill(newRandomUser.department);
        await this.rformSubmit.click();

        return newRandomUser;
    }

    async editUser(index: number,firstName?: string,lastName?: string, email?:string,age?:string,salary?:string,department?:string) {
        expect(index).toBeGreaterThan(-1);
        //open dialog for the given user
        await this.webTableEditBtns.nth(index).click();
        await this.rformTitle.waitFor({state:"visible"});
        await expect(this.rformTitle).toHaveText("Registration Form");

        if (firstName != null) {
            await this.rformFirstName.fill(firstName);
        }
        if (lastName != null) await this.rformLastName.fill(lastName);
        if (email != null) await this.rformEmail.fill(email);
        if (age != null) await this.rformAge.fill(age);
        if (salary != null) await this.rformSalary.fill(salary);
        if (department != null) await this.rformSalary.fill(department);

        await this.rformSubmit.click();
    }

    

    
}

export {WebTablesPage};