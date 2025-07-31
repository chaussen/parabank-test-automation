import { BaseComponent } from "@core/base/BaseComponent";
import { Locator, Page } from "@playwright/test";

export type TitleContext = 'rightPanel' | 'showResult' | 'showOverview' | 'openAccountResult' | 'billpayResult';

export class PageTitle extends BaseComponent {
    private context: TitleContext;

    constructor(context: TitleContext, page: Page) {
        super(page);
        this.context = context;
    }

    get title(): Locator {
        return this.locator(this.getTitleSelector());
    }

    get messageAfterTitle(): Locator {
        return this.page.locator(`${this.getTitleSelector()} + p`);
    }

    private getTitleSelector(): string {
        switch (this.context) {
            case 'rightPanel':
                return 'div#rightPanel h1.title >> visible=true';
            case 'showResult':
                return 'div#showResult h1.title';
            case 'showOverview':
                return 'div#showOverview h1.title';
            case 'openAccountResult':
                return 'div#openAccountResult h1.title';
            case 'billpayResult':
                return 'div#billpayResult h1.title';
            default:
                throw new Error(`Unknown title context: ${this.context}`);
        }
    }

    // Convenience methods for common operations
    async waitFor(options?: { state?: 'attached' | 'detached' | 'visible' | 'hidden'; timeout?: number }) {
        await this.title.waitFor(options);
    }
}