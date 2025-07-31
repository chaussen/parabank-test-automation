import { BaseComponent } from "@core/base/BaseComponent";
import { Locator } from "@playwright/test";

export class NewAccountForm extends BaseComponent {
    get accountTypeDropdown(): Locator {
        return this.locator('select#type');
    }

    get fromAccount(): Locator {
        return this.locator('input#fromAccountId');
    }

    get openAccountButton(): Locator {
        return this.locator('input[value="Open New Account"]');
    }

    async fillNewAccountForm(accountType: string, fromAccountId: string) {
        await this.accountTypeDropdown.selectOption(accountType);
        await this.fromAccount.fill(fromAccountId);
        await this.openAccountButton.click();
    }
}