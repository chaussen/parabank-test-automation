import { Navigation } from "@business/components/Navigation";
import { PageTitle } from "@business/components/PageTitle";
import { Locator, Page } from "@playwright/test";

export class BasePage {
    // Common elements that appear on all authenticated pages
    public readonly pageTitle: PageTitle;
    public readonly leftPanelWelcome: Locator;
    public readonly logoutLink: Locator;

    constructor(
        public readonly navigation: Navigation,
        protected readonly page: Page
    ) {
        this.pageTitle = new PageTitle('rightPanel', this.page);
        this.leftPanelWelcome = this.page.locator('#leftPanel p b');
        this.logoutLink = this.page.locator('a:has-text("Log Out")');
    }


    async logout() {
        await this.logoutLink.click();
    }
}