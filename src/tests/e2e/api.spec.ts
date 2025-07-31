import { generateRandomUser } from '@core/utils/dataGenerator';
import { expect } from '@playwright/test';
import { test } from '@business/fixtures/businessFixtures';
import { Logger } from '@core/utils/logger';
import { Account, Transaction, BillPaymentResult } from '@business/api/ParaBankAPI';

test.describe('ParaBank Pure API Tests', () => {
    test.beforeEach(() => {
        Logger.logTestStep('Starting Pure API test');
    });

    test.afterEach(() => {
        Logger.logTestStep('Pure API test completed');
    });

    test('Pure API - Banking workflow with transaction search', async ({
        paraBankAPI
    }) => {
        test.setTimeout(30000);

        // Step 1: Register user via API
        const user = generateRandomUser();
        Logger.logTestStep(`API: Registering user ${user.username}`);
        await paraBankAPI.registerUserWithSuccess(user);

        // Step 2: Login via API to establish session
        Logger.logTestStep(`API: Logging in user ${user.username}`);
        await paraBankAPI.loginWithSuccess(user.username, user.password);

        // Step 3: Get customer ID from overview page
        Logger.logTestStep('API: Extracting customer ID from overview page');
        const customerId = await paraBankAPI.getOverviewPageAndExtractCustomerId();
        Logger.logSensitiveData('Customer ID extracted', { customerId });

        // Step 4: Get existing accounts to find the default account
        Logger.logTestStep(`API: Getting accounts for customer ${customerId}`);
        const accountsResponse = await paraBankAPI.getCustomerAccounts(customerId);
        expect(accountsResponse.ok()).toBeTruthy();
        
        const accounts: Account[] = await accountsResponse.json();
        Logger.logSensitiveData('Customer Accounts', accounts);
        expect(Array.isArray(accounts)).toBeTruthy();
        expect(accounts.length).toBeGreaterThan(0);
        
        const fromAccountId = accounts[0]!.id.toString(); // Use first account as source
        
        // Step 5: Create a new account via API
        Logger.logTestStep('API: Creating new checking account');
        const createAccountResponse = await paraBankAPI.createAccount(customerId, 0, fromAccountId);
        
        if (createAccountResponse.ok()) {
            const newAccount: Account = await createAccountResponse.json();
            Logger.logSensitiveData('New Account Created', newAccount);
            
            expect(newAccount).toHaveProperty('id');
            expect(newAccount).toHaveProperty('customerId');
            expect(newAccount).toHaveProperty('type');
            expect(newAccount).toHaveProperty('balance');
            expect(newAccount.customerId.toString()).toBe(customerId);
            
            const newAccountId = newAccount.id.toString();
            
            // Step 6: Transfer funds via API
            const transferAmount = '100';
            Logger.logTestStep(`API: Transferring $${transferAmount} from ${fromAccountId} to ${newAccountId}`);
            const transferResponse = await paraBankAPI.transferFunds(fromAccountId, newAccountId, transferAmount);
            expect(transferResponse.ok()).toBeTruthy();
            
            const transferResult = await transferResponse.text();
            expect(transferResult).toContain('Successfully transferred');
            expect(transferResult).toContain(`$${transferAmount}`);
            expect(transferResult).toContain(fromAccountId);
            expect(transferResult).toContain(newAccountId);
            Logger.logSensitiveData('Transfer Result', transferResult);

            // Step 7: Pay bill via API
            const billAmount = '50';
            const payeeData = {
                name: 'Test Payee',
                address: '123 Test St',
                city: 'Test City', 
                state: 'TX',
                zipCode: '12345',
                phoneNumber: '555-0123',
                accountNumber: '987654321'
            };
            
            Logger.logTestStep(`API: Paying bill of $${billAmount} from account ${newAccountId}`);
            const billPayResponse = await paraBankAPI.payBill(newAccountId, billAmount, payeeData);
            const billPayResult: BillPaymentResult = await billPayResponse.json();
            Logger.logSensitiveData('Bill Payment Result', billPayResult);
            expect(billPayResponse.ok()).toBeTruthy();
            
            
            expect(billPayResult).toHaveProperty('payeeName');
            expect(billPayResult).toHaveProperty('amount');
            expect(billPayResult).toHaveProperty('accountId');
            expect(billPayResult.amount).toBe(parseInt(billAmount));
            expect(billPayResult.accountId).toBe(parseInt(newAccountId));
            
            // Step 8: Search transactions by amount
            Logger.logTestStep(`API: Searching for transactions with amount $${billAmount} in account ${newAccountId}`);
            const transactionResponse = await paraBankAPI.findTransactionsByAmount(newAccountId, parseFloat(billAmount));
            expect(transactionResponse.ok()).toBeTruthy();

            const transactionData: Transaction[] = await transactionResponse.json();
            Logger.logSensitiveData('Transaction Search Results', transactionData);

            // Step 9: Validate JSON response structure and data
            expect(Array.isArray(transactionData)).toBeTruthy();
            expect(transactionData.length).toBeGreaterThan(0);

            // Validate each transaction in the response
            transactionData.forEach((transaction: Transaction) => {
                expect(transaction).toHaveProperty('id');
                expect(transaction).toHaveProperty('accountId');
                expect(transaction).toHaveProperty('type');
                expect(transaction).toHaveProperty('date');
                expect(transaction).toHaveProperty('amount');
                expect(transaction).toHaveProperty('description');
                
                expect(transaction.accountId).toBe(parseInt(newAccountId));
                expect(transaction.amount).toBe(parseFloat(billAmount));
                expect(['Credit', 'Debit']).toContain(transaction.type);
                expect(transaction.description).toBeDefined();
                expect(typeof transaction.date).toBe('number');
                expect(typeof transaction.id).toBe('number');
            });

            Logger.logTestStep('API: Pure API banking workflow with transaction search completed successfully');
            
        } else {
            const errorText = await createAccountResponse.text();
            Logger.logError('Account creation failed', errorText);
            throw new Error(`Account creation failed: ${createAccountResponse.status()}`);
        }
    });

    test('Pure API - User registration and basic validation', async ({
        paraBankAPI
    }) => {
        const user = generateRandomUser();
        Logger.logTestStep(`API: Testing user registration for ${user.username}`);
        
        await paraBankAPI.registerUserWithSuccess(user);
        
        await paraBankAPI.loginWithSuccess(user.username, user.password);
        
        Logger.logTestStep('API: Basic user registration and login validation completed');
    });
});