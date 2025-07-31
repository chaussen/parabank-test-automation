import { TransferForm } from "@business/components/TransferForm";
import { Navigation } from "@business/components/Navigation";
import { BillPayForm } from "@business/components/BillPayForm";
import { PageTitle } from "@business/components/PageTitle";
import { expect, Locator, Page } from "@playwright/test";
import { BasePage } from "./BasePage";
import { generateRandomPayee } from "@core/utils/dataGenerator";

export class TransferPage extends BasePage {
    public readonly resultMessage: Locator;
    public readonly transferResult: PageTitle;
    public readonly transferAmountResult: Locator;
    public readonly transferFromAccountResult: Locator;
    public readonly transferToAccountResult: Locator;
    public readonly billPayResult: PageTitle;
    public readonly billPayResultMessage: Locator;

    constructor(
        public readonly transferForm: TransferForm,
        public readonly billPayForm: BillPayForm,
        navigation: Navigation,
        page: Page
    ) {
        super(navigation, page);
        this.transferResult = new PageTitle('showResult', this.page);
        this.resultMessage = this.transferResult.messageAfterTitle;
        this.transferAmountResult = this.resultMessage.locator('span#amountResult');
        this.transferFromAccountResult = this.resultMessage.locator('span#fromAccountIdResult');
        this.transferToAccountResult = this.resultMessage.locator('span#toAccountIdResult');
        this.billPayResult = new PageTitle('billpayResult', this.page);
        this.billPayResultMessage = this.billPayResult.messageAfterTitle;
    }

    async navigateToTransferFunds() {
        await this.navigation.navigateTo('Transfer Funds');
    }

    async transferFunds(fromAccountId: string, toAccountId: string, amount: string) {
        await this.navigation.navigateTo('Transfer Funds');
        await this.transferForm.fillTransfer(fromAccountId, toAccountId, amount);
    }

    async transferFundsByIndexWithSuccess(fromAccountIndex: number, toAccountIndex: number, amount: string): Promise<{ fromAccountId: string, toAccountId: string }> {
        await this.navigation.navigateTo('Transfer Funds');
        const accountIds = await this.transferForm.fillTransferByIndex(fromAccountIndex, toAccountIndex, amount);
        await this.transferResult.waitFor({ state: 'visible' });
        return accountIds;
    }

    async payBill(fromAccountId: string, amount: string) {
        await this.navigation.navigateTo('Bill Pay');

        const payeeData = generateRandomPayee();

        await this.billPayForm.fillBillPayment(
            payeeData.name,
            payeeData.address,
            payeeData.city,
            payeeData.state,
            payeeData.zipCode,
            payeeData.phoneNumber,
            payeeData.accountNumber,
            amount,
            fromAccountId
        );
    }

    async payBillByIndexWithSuccess(fromAccountIndex: number, amount: string) {
        await this.navigation.navigateTo('Bill Pay');

        const payeeData = generateRandomPayee();

        const selectedAccountId = await this.billPayForm.fillBillPaymentByIndex(
            payeeData.name,
            payeeData.address,
            payeeData.city,
            payeeData.state,
            payeeData.zipCode,
            payeeData.phoneNumber,
            payeeData.accountNumber,
            amount,
            fromAccountIndex
        );

        await this.billPayResult.waitFor({ state: 'visible' });
        
        return { selectedAccountId, payeeData };
    }
}