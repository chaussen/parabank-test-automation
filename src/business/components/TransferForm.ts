import { BaseComponent } from "@core/base/BaseComponent";
import { Locator } from "@playwright/test";
export class TransferForm extends BaseComponent {
    get fromAccountDropdown(): Locator {
        return this.locator('select#fromAccountId');
    }

    get toAccountDropdown(): Locator {
        return this.locator('select#toAccountId');
    }

    get amountInput(): Locator {
        return this.locator('input#amount');
    }

    get transferButton(): Locator {
        return this.locator('input[value="Transfer"]');
    }

    async fillTransfer(fromAccount: string, toAccount: string, amount: string) {
        await this.fromAccountDropdown.selectOption(fromAccount);
        await this.toAccountDropdown.selectOption(toAccount);
        await this.amountInput.fill(amount);
        await this.transferButton.click();
    }

    async fillTransferByIndex(fromAccountIndex: number, toAccountIndex: number, amount: string): Promise<{ fromAccountId: string, toAccountId: string }> {
        await this.fromAccountDropdown.selectOption({ index: fromAccountIndex });
        await this.toAccountDropdown.selectOption({ index: toAccountIndex });
        
        // Get the selected account IDs
        const fromAccountId = await this.fromAccountDropdown.inputValue();
        const toAccountId = await this.toAccountDropdown.inputValue();
        
        await this.amountInput.fill(amount);
        await this.transferButton.click();
        
        return { fromAccountId, toAccountId };
    }

    async getFromAccountOptions() {
        return await this.fromAccountDropdown.locator('option').allTextContents();
    }

    async getToAccountOptions() {
        return await this.toAccountDropdown.locator('option').allTextContents();
    }
}