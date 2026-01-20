import { test as base } from '@playwright/test';

import { HomePage } from '../pages/HomePage';
import { ElementsPage } from '../pages/ElementsPage';
import { WebTablesPage } from '../pages/WebTablesPage';
import { LinksPage } from '../pages/LinksPage';
import {PracticeFormPage} from '../pages/PracticeFormPage';
import { AlertsFramesWindowsPages } from '../pages/AlertsFramesWindowsPages';
import { WidgetsPage } from '../pages/WidgetsPage';
import { InteractionsPage} from '../pages/InteractionsPage';
import { BookStoreApplication } from '../pages/BookStoreApplication';


declare module '@playwright/test' {
  interface TestFixtures {
    homePage : HomePage;
    elementsPage: ElementsPage;
    webTablesPage : WebTablesPage;
    linksPage : LinksPage;
    practiceFormPage : PracticeFormPage;
    alertsFramesWindowsPages : AlertsFramesWindowsPages;
    widgetsPage : WidgetsPage;
    interactionsPage : InteractionsPage;
    bookstoreApplication : BookStoreApplication;
  }
}


//page.goto appends to existing baseUrl set in playwright.config.js
export const test = base.extend<{
  homePage : HomePage;
  elementsPage : ElementsPage;
  webTablesPage : WebTablesPage;
  linksPage : LinksPage;
  practiceFormPage : PracticeFormPage;
  alertsFramesWindowsPages : AlertsFramesWindowsPages;
  widgetsPage : WidgetsPage;  
  interactionsPage : InteractionsPage;
  bookstoreApplication : BookStoreApplication;
}>
({
  homePage: async ({ page }, use) => {
    await page.goto('/'); // appends to baseURL set in config
    await use (new HomePage(page));
  },
  elementsPage : async ({page}, use) => {
    await use (new ElementsPage(page));
  },
  webTablesPage : async ({page}, use) => {
    await use (new WebTablesPage(page));
  },
  linksPage : async ({page}, use) => {
    await use (new LinksPage(page));
  },
  practiceFormPage : async ({page}, use) => {
    await use (new PracticeFormPage(page));
  },
  alertsFramesWindowsPages: async ({page}, use) => {
    await use (new AlertsFramesWindowsPages(page));
  },
  widgetsPage : async ({page}, use )=> {
    await use (new WidgetsPage(page));
  },
  interactionsPage : async ({page}, use) => {
    await use (new InteractionsPage(page));
  },
  bookstoreApplication : async ({page}, use) => {
    await use (new BookStoreApplication(page));
  }
    
});

export const expect = test.expect;