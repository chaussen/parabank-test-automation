import { BaseComponent } from "@core/base/BaseComponent";
import { Locator } from "@playwright/test";
export class AccountTable extends BaseComponent {
    get accountTable(): Locator {
        return this.locator('table#accountTable');
    }

    async getBalance(accountNumber: string): Promise<string> {
        const row = this.getRowByAccountNumber(accountNumber);
        return this.getCellByRowAndHeader(row, 'Balance');
    }

    async getAvailableAmount(accountNumber: string): Promise<string> {
        const row = this.getRowByAccountNumber(accountNumber);
        return this.getCellByRowAndHeader(row, 'Available Amount');
    }

    get tableRows(): Locator {
        return this.accountTable.locator('tbody tr');
    }

    get tableHeaders(): Locator {
        return this.accountTable.locator('thead th');
    }

    getRowByAccountNumber(accountNumber: string): Locator {
        // Find the row that contains a link with the exact account number
        return this.tableRows.filter({ has: this.page.locator(`td a:has-text("${accountNumber}")`) });
    }

    async getCellByRowAndHeader(row: Locator, header: string): Promise<string> {
        const allHeaders = await this.tableHeaders.allTextContents();
        if (allHeaders.length === 0) {
            throw new Error("No headers found in the account table.");
        }
        const actualHeader = allHeaders.find(h => h.trim().includes(header));
        if (!actualHeader) {
            throw new Error(`Header "${header}" not found in the account table.`);
        }
        const headerIndex = allHeaders.indexOf(actualHeader);
        const text = await row.locator(`td:nth-child(${headerIndex + 1})`).textContent();
        return text === null ? '' : text.trim();
    }
}