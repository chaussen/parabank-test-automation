import { test as base } from '@playwright/test';
import { BaseFixtures } from '@core/base/BaseFixtures';

import { NewAccountForm } from '@business/components/NewAccountForm';
import { LoginForm } from '@business/components/LoginForm';
import { RegisterForm } from '@business/components/RegisterForm';
import { Navigation } from '@business/components/Navigation';
import { HomePage } from '@business/pages/HomePage';
import { AccountServicePage } from '@business/pages/AccountServicePage';
import { TransferPage } from '@business/pages/TransferPage';
import { ParaBankAPI } from '@business/api/ParaBankAPI';
import { AccountTable } from '@business/components/AccountTable';
import { TransferForm } from '@business/components/TransferForm';
import { BillPayForm } from '@business/components/BillPayForm';

type BusinessFixtures = BaseFixtures & {
    homePage: HomePage;
    accountServicePage: AccountServicePage;
    transferPage: TransferPage;
    paraBankAPI: ParaBankAPI;
    newAccountForm: NewAccountForm;
    loginForm: LoginForm;
    registerForm: RegisterForm;
    navigation: Navigation;
    accountTable: AccountTable;
    transferForm: TransferForm;
    billPayForm: BillPayForm;
}

export const test = base.extend<BusinessFixtures>({
    loginForm: async ({ page }, use) => {
        const loginForm = new LoginForm(page);
        await use(loginForm);
    },
    registerForm: async ({ page }, use) => {
        const registerForm = new RegisterForm(page);
        await use(registerForm);
    },
    navigation: async ({ page }, use) => {
        const navigation = new Navigation(page);
        await use(navigation);
    },
    newAccountForm: async ({ page }, use) => {
        const newAccountForm = new NewAccountForm(page);
        await use(newAccountForm);
    },
    accountTable: async ({ page }, use) => {
        const accountTable = new AccountTable(page);
        await use(accountTable);
    },
    transferForm: async ({ page }, use) => {
        const transferForm = new TransferForm(page);
        await use(transferForm);
    },
    billPayForm: async ({ page }, use) => {
        const billPayForm = new BillPayForm(page);
        await use(billPayForm);
    },
    homePage: async ({ page, loginForm, registerForm }, use) => {
        const homePage = new HomePage(
            loginForm,
            registerForm,
            page
        );
        await use(homePage);
    },
    accountServicePage: async ({ page, navigation, accountTable, newAccountForm }, use) => {
        const accountServicePage = new AccountServicePage(
            accountTable,
            newAccountForm,
            navigation,
            page
        );
        await use(accountServicePage);
    },
    transferPage: async ({ page, navigation, transferForm, billPayForm }, use) => {
        const transferPage = new TransferPage(
            transferForm,
            billPayForm,
            navigation,
            page
        );
        await use(transferPage);
    },
    paraBankAPI: async ({ request }, use) => {
        const apiClient = new ParaBankAPI(request);
        await use(apiClient);
    }
});