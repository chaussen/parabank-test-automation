import { BaseComponent } from "@core/base/BaseComponent";
import { Locator } from "@playwright/test";

export class BillPayForm extends BaseComponent {
    get payeeNameInput(): Locator {
        return this.locator('input[name="payee.name"]');
    }

    get payeeAddressInput(): Locator {
        return this.locator('input[name="payee.address.street"]');
    }

    get payeeCityInput(): Locator {
        return this.locator('input[name="payee.address.city"]');
    }

    get payeeStateInput(): Locator {
        return this.locator('input[name="payee.address.state"]');
    }

    get payeeZipCodeInput(): Locator {
        return this.locator('input[name="payee.address.zipCode"]');
    }

    get payeePhoneNumberInput(): Locator {
        return this.locator('input[name="payee.phoneNumber"]');
    }

    get accountNumberInput(): Locator {
        return this.locator('input[name="payee.accountNumber"]');
    }

    get verifyAccountNumberInput(): Locator {
        return this.locator('input[name="verifyAccount"]');
    }

    get amountInput(): Locator {
        return this.locator('input[name="amount"]');
    }

    get sendPaymentButton(): Locator {
        return this.locator('input[value="Send Payment"]');
    }

    get fromAccountDropdown(): Locator {
        return this.locator('select[name=fromAccountId]');
    }

    private async fillBillPaymentForm(
        payeeName: string,
        payeeAddress: string,
        payeeCity: string,
        payeeState: string,
        payeeZipCode: string,
        payeePhoneNumber: string,
        accountNumber: string,
        amount: string
    ) {
        await this.payeeNameInput.fill(payeeName);
        await this.payeeAddressInput.fill(payeeAddress);
        await this.payeeCityInput.fill(payeeCity);
        await this.payeeStateInput.fill(payeeState);
        await this.payeeZipCodeInput.fill(payeeZipCode);
        await this.payeePhoneNumberInput.fill(payeePhoneNumber);
        await this.accountNumberInput.fill(accountNumber);
        await this.verifyAccountNumberInput.fill(accountNumber);
        await this.amountInput.fill(amount);
    }

    async fillBillPayment(
        payeeName: string,
        payeeAddress: string,
        payeeCity: string,
        payeeState: string,
        payeeZipCode: string,
        payeePhoneNumber: string,
        accountNumber: string,
        amount: string,
        fromAccount?: string
    ) {
        await this.fillBillPaymentForm(
            payeeName,
            payeeAddress,
            payeeCity,
            payeeState,
            payeeZipCode,
            payeePhoneNumber,
            accountNumber,
            amount
        );

        if (fromAccount) {
            await this.fromAccountDropdown.selectOption(fromAccount);
        }
        await this.sendPaymentButton.click();
    }

    async fillBillPaymentByIndex(
        payeeName: string,
        payeeAddress: string,
        payeeCity: string,
        payeeState: string,
        payeeZipCode: string,
        payeePhoneNumber: string,
        accountNumber: string,
        amount: string,
        fromAccountIndex: number
    ): Promise<string> {
        await this.fillBillPaymentForm(
            payeeName,
            payeeAddress,
            payeeCity,
            payeeState,
            payeeZipCode,
            payeePhoneNumber,
            accountNumber,
            amount
        );

        // Select account by index and get the selected account ID
        await this.fromAccountDropdown.selectOption({ index: fromAccountIndex });
        const selectedAccountId = await this.fromAccountDropdown.inputValue();

        await this.sendPaymentButton.click();

        return selectedAccountId;
    }
}
