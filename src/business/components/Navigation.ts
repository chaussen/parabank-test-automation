import { BaseComponent } from "@core/base/BaseComponent";
import { Locator } from "@playwright/test";
export const navigationItemTextTitleMapping = {
    'Accounts Overview': 'Accounts Overview',
    'Open New Account': 'Open New Account',
    'Transfer Funds': 'Transfer Funds',
    'Bill Pay': 'Bill Payment Service',
    'Find Transactions': 'Find Transactions',
    'Update Contact Info': 'Update Profile',
    'Request Loan': 'Apply for a Loan',
    'Log Out': ''
} as const;

export type NavigationItemText = keyof typeof navigationItemTextTitleMapping;
export class Navigation extends BaseComponent {
    navigationItem(text: NavigationItemText): Locator {
        return this.locator('div#leftPanel').getByText(text, { exact: true });
    }

    async navigateTo(text: NavigationItemText) {
        await this.navigationItem(text).click();
    }
}