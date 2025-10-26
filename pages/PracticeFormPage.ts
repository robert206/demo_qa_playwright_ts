import { Page, Locator, expect } from '@playwright/test';
import { strict } from 'assert';

//has some duplicate code with ElementsPage but on purpose so its cleaner in its own POM class
class PracticeFormPage {
    readonly page: Page;
    readonly practiceFormHarmonicaBtn: Locator;
    readonly formsBtn : Locator;

    readonly firstName: Locator;
    readonly lastName: Locator;
    readonly email: Locator;
    readonly genderRadioButtonsList: Locator;
    readonly mobileNumber: Locator;
    readonly dateOfBirthInput: Locator;
    readonly subjectsInput: Locator;
    readonly hobbiesCheckboxes: Locator;
    readonly uploadPictureInput: Locator;
    readonly currentAddress: Locator;

    readonly stateDropdown: Locator;
    readonly stateOptions : Locator;
    readonly cityDropdown: Locator;
    readonly submitButton: Locator;
    readonly formTitle: Locator;


    //submission dialog
    readonly submissionTitle: Locator;
    readonly submissionTable: Locator; // remove if not needed later
    readonly submissionTableLabels : Locator;
    readonly submissionTableValues : Locator;
    readonly closeBtn: Locator;

    //for data generation forms
    private firstNames: string[] = [
        'Blast', 'Bolt', 'Slab', 'Brick', 'Stone', 'Rock', 'Steel', 'Iron', 'Slate', 'Ridge',
        'Brock', 'Dirk', 'Slate', 'Cannon', 'Bullet', 'Blaze', 'Crash', 'Rocket', 'Tank', 'Sledge',
        'Magnum', 'Razor', 'Gash', 'Punch', 'Kick', 'Smash', 'Crunch', 'Thump', 'Whack', 'Bash',
        'Crank', 'Gear', 'Piston', 'Rivet', 'Hammer', 'Wrench', 'Nail', 'Screw', 'Bolt', 'Spike'
    ];

     private lastNames: string[] = [
        'Hardcheese', 'Thunderpants', 'Steelbottom', 'Ironjaw', 'Rockfist', 'Hammerhead',
        'Bloodaxe', 'Deathblow', 'Killshot', 'Painbringer', 'Smashem', 'Crushmore',
        'McShooty', 'Van Boom', 'Destructo', 'Annihilator', 'Pulverizer', 'Demolisher',
        'Facepunch', 'Gutkick', 'Nosebreaker', 'Kidneypunch', 'Spleenshooter', 'Liverbuster',
        'McMassive', 'Von Hugenstein', 'La Boom', 'Di Destructo', 'Van Pain', 'McHurty'
    ];

    private subjects: string[] = ["Slovenian","English","Blabla", "Fizika","Chemistry","Maths"];

    private addressWords: string[] = [
        'Street', 'Avenue', 'Boulevard', 'Lane', 'Drive', 'Road', 'Terrace', 'Place', 'Court', 'Circle',
        'Parkway', 'Way', 'Trail', 'Crescent', 'Square', 'Alley', 'Plaza', 'Highway', 'Expressway', 'Freeway'
    ];





    constructor(page: Page) {
        this.page = page;
        this.formsBtn= page.locator('span.text').getByText('Practice Form');
        this.practiceFormHarmonicaBtn = page.locator('span.pr-1',{hasText : "Forms"});
        //form
        this.firstName = page.locator('#firstName');
        this.lastName = page.locator('#lastName');
        this.email = page.locator('#userEmail');
        //this.genderRadioButtonsList = page.locator('input[name="gender"]');
        this.genderRadioButtonsList = page.locator('div.custom-radio > label[for]');
        this.mobileNumber = page.locator('#userNumber');
        this.dateOfBirthInput = page.locator('#dateOfBirthInput');
        this.subjectsInput = page.locator('#subjectsInput');
        //this.hobbiesCheckboxes = page.locator('input[type="checkbox"]'); // locator for all checkboxes on form
        //replace with label for checkboxes drgac ne dela
        this.hobbiesCheckboxes = page.locator('div.custom-checkbox >label[for]');
        this.uploadPictureInput = page.locator('#uploadPicture');
        this.currentAddress = page.locator('#currentAddress');

        this.stateDropdown = page.locator('#state');

        this.cityDropdown = page.locator('#city');
        this.submitButton = page.locator('#submit');
        this.formTitle = page.locator('.practice-form-wrapper h5');

        //submission dialog
        this.submissionTitle = page.locator('div.modal-title.h4');
        this.closeBtn = page.locator('#closeLargeModal');
        this.submissionTable = page.locator('tbody > tr > td')
        this.submissionTableLabels = page.locator('tbody > tr > td:nth-child(1)');
        this.submissionTableValues = page.locator('tbody > tr > td:nth-child(2)');

    }

    /** Various getters for filling fields of data in the form
     * 
     */
     getRandomFirstName(): string {
        const randomIndex = Math.floor(Math.random() * this.firstNames.length);
        return this.firstNames[randomIndex];
    }


     getRandomLastName(): string {
        const randomIndex = Math.floor(Math.random() * this.lastNames.length);
        return this.lastNames[randomIndex];
    }

    
    getRandomEmail(): string {
        const randomFirstName = this.getRandomFirstName().toLowerCase();
        return randomFirstName + "@drek.si";
    }


    getRandomMobileNumber(): string {
        let mobileNum = "";
        for (let i=0; i < 10; i++) {
            mobileNum = mobileNum + Math.floor(Math.random() * 10).toString();
        }
        return mobileNum;
    }


    getRandomSubject(): string {
        const randomIndex = Math.floor(Math.random() * this.subjects.length);
        return this.subjects[randomIndex];
    }


    getRandomAddress(): string {
        const randomIndex = Math.floor(Math.random() * this.addressWords.length);
        const randNum = Math.floor(Math.random() * 1000).toString();
        return this.addressWords[randomIndex] + " " + randNum;
    }


    /**
     * 
     */
    //select random gender
    //problems with these buttons is that sometimes ads interfere with clicking,force click doesnt always help
    // so i will add some adBlock function that i generated with deepseek ai tool --hmm 
       


    async selectRandomGender(): Promise<string> {
        const count = await this.genderRadioButtonsList.count();
        const randomIndex = Math.floor(Math.random() * count);
        //const texts = await this.page.locator(`[for="gender-radio-${randomIndex+1}"].custom-control-label`).allInnerTexts();
        //console.log(count,texts);

        //assertion to verify radio button is checked
        if (!await this.genderRadioButtonsList.nth(randomIndex).isChecked()) {
            await this.genderRadioButtonsList.nth(randomIndex).scrollIntoViewIfNeeded();
            await this.genderRadioButtonsList.nth(randomIndex).click({ force: true });
        }
        await expect(this.genderRadioButtonsList.nth(randomIndex)).toBeChecked();
 
        const genderText = await this.genderRadioButtonsList.nth(randomIndex).textContent();
        return genderText;
    }



    async selectRandomHobby(): Promise<string> {
        const count = await this.hobbiesCheckboxes.count();
        const randomIndex = Math.floor(Math.random() * count);

        //assertion to verify checkbox is checked
        if (!await this.hobbiesCheckboxes.nth(randomIndex).isChecked()) {
            await this.hobbiesCheckboxes.nth(randomIndex).scrollIntoViewIfNeeded();
            await this.hobbiesCheckboxes.nth(randomIndex).click({ force: true });
        }
        //assert
        await expect(this.hobbiesCheckboxes.nth(randomIndex)).toBeChecked();

        const hobbyText = await this.hobbiesCheckboxes.nth(randomIndex).textContent();
        return hobbyText;
    }




    async selectState(): Promise<string> {
        await this.stateDropdown.click();
        const stateTexts = await this.stateDropdown.allInnerTexts();

        const stateNames = stateTexts[0].split('\n').filter(line =>
            line && 
            !line.includes('option') && 
            !line.includes('focused') && 
            !line.includes('results available') && 
            !line.includes('Use Up and Down') && 
            !line.includes('press Enter') && 
            !line.includes('Select State') &&
            line.trim() !== ''
        );
        //select random state
        const randomIndex = Math.floor(Math.random() * stateNames.length);
        await this.page.getByText(stateNames[randomIndex], { exact: true }).click();

        
        await expect(this.stateDropdown).toContainText(stateNames[randomIndex]);

        //const stateText = await this.stateDropdown.nth(randomIndex).textContent();
        const stateText = stateNames[randomIndex];
        return stateText;
        
    }



    //select random city from dropdown
    async selectCity(): Promise<string> {
        await this.cityDropdown.click();
        const cityTexts = await this.cityDropdown.allInnerTexts();

        const cityNames = cityTexts[0].split('\n').filter(line =>
            line && 
            !line.includes('option') && 
            !line.includes('focused') && 
            !line.includes('results available') && 
            !line.includes('Use Up and Down') && 
            !line.includes('press Enter') && 
            !line.includes('Select City') &&
            line.trim() !== ''
        );
        const randomIndex = Math.floor(Math.random() * cityNames.length);
        await this.page.getByText(cityNames[randomIndex], { exact: true }).click();
        await expect(this.cityDropdown).toContainText(cityNames[randomIndex]);  
        
        const cityText = cityNames[randomIndex]; // return city name
        return cityText;
    }



    //populates all fields with random generated data and returns object with expected data for later assertion
    async populateForm(): Promise<Record<string, string>> {
        let expectedTableData = {"Student Name": "", "Student Email" : "", "Gender" : "", "Mobile" : "",
                                "Subjects" : "", "Hobbies" : "", "Address" : "", "State and City" : ""
        };

        await expect(this.formTitle).toHaveText('Student Registration Form');
        //lets store for refference ce ne cannot do assertion
        const firstName = this.getRandomFirstName();
        expectedTableData["Student Name"] = firstName;
        const lastName = this.getRandomLastName();
        expectedTableData["Student Name"] = expectedTableData["Student Name"] + " " + lastName;
        await this.firstName.fill(firstName);
        await this.lastName.fill(lastName);

        const email = this.getRandomEmail();
        expectedTableData["Student Email"] = email;
        await this.email.fill(email);
        
        const mobile = this.getRandomMobileNumber();
        expectedTableData["Mobile"] = mobile;
        await this.mobileNumber.fill(mobile);

        const subject = this.getRandomSubject();
        expectedTableData["Subjects"] = subject;
        await this.subjectsInput.fill(subject);

        const address = this.getRandomAddress();
        expectedTableData["Address"] = address;
        await this.currentAddress.fill(address);
       
        const gender = await this.selectRandomGender();
        expectedTableData["Gender"] = gender;
        
        const hobby = await this.selectRandomHobby();
        expectedTableData["Hobbies"] = hobby;
        const state = await this.selectState();
        expectedTableData["State and City"] = state;
        const city = await this.selectCity();
        expectedTableData["State and City"] = expectedTableData["State and City"] + " " + city;

        return expectedTableData;
    }




    async submitForm(): Promise<void> {
        await this.submitButton.click();
        await this.submissionTitle.waitFor({state:"visible"});
        const headerText = await this.submissionTitle.textContent();
        console.log("Submission dialog title text: ",headerText);
        strict.equal(headerText, "Thanks for submitting the form", "Submission dialog title text does not match expected");
        await expect(this.submissionTitle).toBeVisible();
    }


    //find diffs between forms data entered and expected and store them 
    findDifferences (expectedRecord: Record<string, string>, actualRecord: Record<string, string>) : string[] {
        const diffs: string[] = []; 

        for (const key in expectedRecord) {
            if (expectedRecord[key] != actualRecord[key]) {
                diffs.push(`Mismatch for ${key}: expected "${expectedRecord[key]}", but got "${actualRecord[key]}"`);
            }
        }
        return diffs;
    }


    //site has actual bug on Subjects so it will always..
    async assertFormSubmission(expectedRecord: Record<string,string>): Promise<void> {
        const actualLabels : string[] = await this.submissionTableLabels.allInnerTexts();//get all labels/keys
        const actualValues : string[] = await this.submissionTableValues.allInnerTexts(); // get akk values

        //store actual data from table into record 
        const actualTableData : Record<string, string> = {};
        for (let i =0; i < actualLabels.length; i++) {
            if (expectedRecord.hasOwnProperty(actualLabels[i])) {
                actualTableData[actualLabels[i]] = actualValues[i];
            }
        }
        const diffs : string[] = this.findDifferences(expectedRecord, actualTableData);
        if (diffs.length != 0) {
            console.log("Submited form data does not match expected stuff");
            console.log(diffs);
        }
        expect(diffs.length).toBe(0);//still lets assert so playwright reports as failed test
    }


}

export {PracticeFormPage};