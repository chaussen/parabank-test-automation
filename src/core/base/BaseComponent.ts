import { Page, Locator } from '@playwright/test';

export abstract class BaseComponent {
    protected page: Page;
    constructor(page: Page) {
        this.page = page;
    }

    protected getByRole(role: Parameters<Page['getByRole']>[0], options?: Parameters<Page['getByRole']>[1]): Locator {
        return this.page.getByRole(role, options);
    }

    protected getByTestId(testId: string): Locator {
        return this.page.getByTestId(testId);
    }

    protected getByText(text: string, options?: Parameters<Page['getByText']>[1]): Locator {
        return this.page.getByText(text, options);
    }

    protected getByLabel(label: string, options?: Parameters<Page['getByLabel']>[1]): Locator {
        return this.page.getByLabel(label, options);
    }

    protected getByPlaceholder(placeholder: string, options?: Parameters<Page['getByPlaceholder']>[1]): Locator {
        return this.page.getByPlaceholder(placeholder, options);
    }


    protected locator(selector: string): Locator {
        return this.page.locator(selector);
    }
}