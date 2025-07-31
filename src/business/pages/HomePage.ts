import { LoginForm } from "@business/components/LoginForm";
import { RegisterForm } from "@business/components/RegisterForm";
import { PageTitle } from "@business/components/PageTitle";
import { User } from "@core/utils/dataGenerator";
import { expect, Locator } from "@playwright/test";
import { Page } from "@playwright/test";

export class HomePage {
    public readonly registerLink: Locator;
    public readonly homeLink: Locator;
    public readonly welcomeTitle: PageTitle;
    public readonly registrationSuccessMessage: Locator;

    constructor(
        public readonly loginForm: LoginForm,
        public readonly registerForm: RegisterForm,
        private readonly page: Page
    ) {
        this.registerLink = this.page.getByText('Register', { exact: true });
        this.homeLink = this.page.locator('a[href="index.htm"]');
        this.welcomeTitle = new PageTitle('rightPanel', this.page);
        this.registrationSuccessMessage = this.page.locator('div#rightPanel p');
    }

    async navigateToRegistration() {
        await this.page.waitForLoadState('networkidle');
        await expect(this.registerLink).toBeVisible();
        await this.registerLink.click();
        await this.page.waitForLoadState('networkidle');
    }

    async registerNewUser(user: User) {
        await this.navigateToRegistration();
        await this.registerForm.fillAndSubmit(user);
    }

    async loginUser(username: string, password: string) {
        await this.loginForm.usernameInput.fill(username);
        await this.loginForm.passwordInput.fill(password);
        await this.loginForm.loginButton.click();
    }
}