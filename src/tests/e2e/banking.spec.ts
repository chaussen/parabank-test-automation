import { generateRandomUser } from '@core/utils/dataGenerator';
import { expect } from '@playwright/test';
import { test } from '@business/fixtures/businessFixtures';
import { Logger } from '@core/utils/logger';

test.describe('ParaBank UI Banking Tests', () => {
    test.beforeEach(async () => {
        // Clear previous log entries before each test
        Logger.clearLogFile();
        Logger.logTestStep('Starting UI Banking Test');
    });

    test.afterEach(async ({ page }) => {
        // Clean up after each test
        Logger.logTestStep('UI test completed - cleaning up');
        await page.close();
    });

    test('Complete banking user journey via UI', async ({
        page,
        homePage,
        accountServicePage,
        transferPage,
        paraBankAPI
    }) => {
        // Increase timeout for this test
        test.setTimeout(30000);
        const CURRENCY_FORMAT = /^\$\d+\.\d{2}$/;

        // Step 1: Navigate to Para bank application
        Logger.logTestStep('Step 1: Navigate to ParaBank application');
        await page.goto('/parabank/index.htm');
        await expect(page).toHaveTitle(/ParaBank/);

        // Step 2: Create a new user via API (to avoid captcha issues in main flow)
        Logger.logTestStep('Step 2: Create new user via API');
        const user = generateRandomUser();
        Logger.logUserCredentials(user.username, user.password, 'User Registration');
        await paraBankAPI.registerUserWithSuccess(user);
        Logger.logTestStep(`Created user via API: ${user.username}`);

        // Step 3: Login to the application with the user created in step 2
        Logger.logTestStep('Step 3: Login with created user');
        await homePage.loginUser(user.username, user.password);

        // Verify successful login
        await expect(accountServicePage.accountsOverviewTitle.title).toContainText('Accounts Overview');

        // Step 4: Verify if the Global navigation menu in home page is working as expected
        await accountServicePage.verifyNavigationMenu();

        // Step 5: Create a Savings account from "Open New Account Page" and capture the account number
        const savingsAccountNumber = await accountServicePage.createSavingsAccount();
        Logger.logTestStep(`Created Savings Account: ${savingsAccountNumber}`);

        // Verify account creation success
        await expect(accountServicePage.accountOpenedTitle.title).toContainText('Account Opened!');
        await expect(accountServicePage.successMessage).toContainText('Congratulations, your account is now open.');

        // Step 6: Validate if Accounts overview page is displaying the balance details as expected
        const initialBalance = await accountServicePage.getAccountBalance(savingsAccountNumber);
        Logger.logTestStep(`Initial Savings Account Balance: ${initialBalance}`);

        // Verify accounts overview page displays correctly
        await expect(accountServicePage.accountsOverviewTitle.title).toContainText('Accounts Overview');
        await expect(accountServicePage.accountTableElement).toBeVisible();
        const savingsAccountBalance = await accountServicePage.getAccountBalance(savingsAccountNumber);
        expect(savingsAccountBalance).toBeDefined();
        expect(savingsAccountBalance).toMatch(CURRENCY_FORMAT);

        // Step 7: Transfer funds from original account to savings account
        const transferAmount = '100.00';
        const FROM_ACCOUNT_INDEX = 0; // First account (original account)
        const TO_ACCOUNT_INDEX = 0;   // Second account (savings account)

        const { fromAccountId, toAccountId } = await transferPage.transferFundsByIndexWithSuccess(FROM_ACCOUNT_INDEX, TO_ACCOUNT_INDEX, transferAmount);

        // Verify transfer success
        await expect(transferPage.transferResult.title).toContainText('Transfer Complete!');
        await expect(transferPage.transferAmountResult).toContainText(`$${transferAmount}`);
        await expect(transferPage.transferFromAccountResult).toContainText(fromAccountId);
        await expect(transferPage.transferToAccountResult).toContainText(toAccountId);

        // Step 8: Pay the bill with account created in step 5
        const billAmount = '50.00';
        const BILL_PAY_ACCOUNT_INDEX = 0; // Second account (savings account) for bill payment

        const { selectedAccountId: billPayAccountId, payeeData } = await transferPage.payBillByIndexWithSuccess(BILL_PAY_ACCOUNT_INDEX, billAmount);

        // Verify bill payment success
        await expect(transferPage.billPayResult.title).toContainText('Bill Payment Complete');
        await expect(transferPage.billPayResultMessage).toContainText(`Bill Payment to ${payeeData.name} in the amount of $${billAmount} from account ${billPayAccountId} was successful`);

        // Step 9: Verify final account balance is displayed correctly
        const finalBalance = await accountServicePage.getFinalAccountBalance(billPayAccountId);
        Logger.logTestStep(`Final Savings Account Balance: ${finalBalance}`);

        // Assert that final balance is displayed in valid currency format
        expect(finalBalance).toMatch(CURRENCY_FORMAT);

        Logger.logTestStep('UI Banking Test completed successfully');
    });
});