import { Navigation, navigationItemTextTitleMapping } from "@business/components/Navigation";
import { AccountTable } from "@business/components/AccountTable";
import { NewAccountForm } from "@business/components/NewAccountForm";
import { PageTitle } from "@business/components/PageTitle";
import { expect, Locator, Page } from "@playwright/test";
import { BasePage } from "./BasePage";

export class AccountServicePage extends BasePage {
    public readonly accountsOverviewTitle: PageTitle;
    public readonly fromAccountSelect: Locator;
    public readonly newAccountId: Locator;
    public readonly successMessage: Locator;
    public readonly accountTableElement: Locator;
    public readonly accountOpenedTitle: PageTitle;

    constructor(
        public readonly accountTable: AccountTable,
        public readonly newAccountForm: NewAccountForm,
        navigation: Navigation,
        page: Page
    ) {
        super(navigation, page);
        this.accountsOverviewTitle = new PageTitle('showOverview', this.page);
        this.accountOpenedTitle = new PageTitle('openAccountResult', this.page);
        this.fromAccountSelect = this.page.locator('select#fromAccountId');
        this.newAccountId = this.page.locator('#newAccountId');
        this.successMessage = this.accountOpenedTitle.messageAfterTitle;
        this.accountTableElement = this.page.locator('#accountTable');
    }

    async navigateToAccountsOverview() {
        await this.navigation.navigateTo('Accounts Overview');
    }

    async createSavingsAccount() {
        await this.navigation.navigateTo('Open New Account');
        await this.newAccountForm.accountTypeDropdown.selectOption('SAVINGS');
        await this.newAccountForm.openAccountButton.click();
        const savingsAccountNumber = await this.newAccountId.textContent();
        return savingsAccountNumber!;
    }

    async getAccountBalance(accountNumber: string) {
        await this.navigation.navigateTo('Accounts Overview');

        // Use the AccountTable component to get balance
        return await this.accountTable.getBalance(accountNumber);
    }

    async createNewAccount(accountType: string, fromAccountId: string) {
        await this.navigation.navigateTo('Open New Account');
        await this.newAccountForm.fillNewAccountForm(accountType, fromAccountId);
    }

    async getFinalAccountBalance(accountNumber: string) {
        await this.navigation.navigateTo('Accounts Overview');
        return await this.accountTable.getBalance(accountNumber);
    }

    async verifyNavigationMenu() {
        // loop through key value pairs in navigationItemTextTitleMapping
        for (const [item, expectedTitle] of Object.entries(navigationItemTextTitleMapping)) {

            const navLink = this.page.locator(`a:has-text("${item}")`);
            await expect(navLink).toBeVisible();

            if (item !== 'Log Out') {
                await navLink.click();

                const rightPanelTitle = new PageTitle('rightPanel', this.page);

                await expect(rightPanelTitle.title).toContainText(expectedTitle);
            }
        }
    }
}