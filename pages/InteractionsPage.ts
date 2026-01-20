import {Page, Locator, expect} from '@playwright/test';

class InteractionsPage {

    readonly page: Page;

    //Sortable page
    readonly sortablePageUrl : string = '/sortable';
    readonly sortableCard : Locator;
    readonly sortableTabList : Locator;
    readonly sortableGridTab : Locator;
    readonly sortableList : Locator;
    readonly sortableGrid : Locator;

    //Selectable page
    readonly selectablePageUrl : string = '/selectable';
    readonly selectableCard : Locator;
    readonly selectableTabList : Locator;
    readonly selectableList : Locator

    //Resizable page
    readonly resizablePageUrl : string = '/resizable';
    readonly resizableCard : Locator;
    readonly resizableBox : Locator;
    readonly resizableBoxHandle : Locator;
    readonly resizableBox2 : Locator;
    readonly resizableBox2Handle : Locator;

    //Droppable page
    readonly droppablePageUrl : string = '/droppable';


    constructor(page : Page) {
        this.page = page;

        //SortablePage
        this.sortableCard = page.locator('span.text').filter({hasText: 'Sortable'});
        this.sortableTabList = page.locator('#demo-tab-list');
        this.sortableList = page.locator('#demo-tabpane-list > div.vertical-list-container.mt-4 > div');
        this.sortableGridTab = page.locator('#demo-tab-grid');
        this.sortableGrid = page.locator('#demo-tabpane-grid > div.grid-container.mt-4 > div.create-grid > div');
        //Selectable page
        this.selectableCard = page.locator('span.text').filter({hasText: 'Selectable'});
        this.selectableTabList = page.locator('#demo-tab-list');
        this.selectableList = page.locator('li.mt-2.list-group-item.list-group-item-action');
        //.... same for Grid Tab ...

        //resizable page
        this.resizableCard = page.locator('span.text').filter({hasText: 'Resizable'});
        this.resizableBox = page.locator('#resizableBoxWithRestriction');
        this.resizableBoxHandle = page.locator('#resizableBoxWithRestriction > span');
        this.resizableBox2 = page.locator('#resizable');
        this.resizableBox2Handle = page.locator('#resizable > span');


        
    }

    
    // drag &drop by item text
    async dragDropListItem(sourceItemText : string, targetItemText : string) {
        const sourceItem = this.sortableList.getByText(sourceItemText, { exact: true });
        const targetItem = this.sortableList.getByText(targetItemText, {exact : true});
        
        await sourceItem.dragTo(targetItem);
    }


    // drag and drop by item index
    async dragDropListItemByIndex (sourceIndex : number, targetIndex: number) {
        const sourceItem = this.sortableList.nth(sourceIndex);
        const targetItem = this.sortableList.nth(targetIndex);

        //drag and drop
        await sourceItem.dragTo(targetItem);
    }

    // drag and drop two random items in list and return their indekses
    async dragDropItemListRandomly (list: Locator) : Promise <[number, number]> {
        const noOfItems = await list.count();
        const rIndex = Math.floor(Math.random() * noOfItems );
        const rIndex2 = Math.floor(Math.random() * noOfItems );
        const sourceItem = list.nth(rIndex);
        const targetItem = list.nth(rIndex2);

        if (rIndex !== rIndex2) {
            await sourceItem.dragTo(targetItem); //builtin drag and drop that works ok for these elements (see more approaches in repo)
        }
        return [rIndex, rIndex2];
    }

    // select item by its index
    async selectItemByIndex (list: Locator, index : number) {
        const item = list.nth(index);
        await item.click(); 
    }
    
}


export {InteractionsPage};
