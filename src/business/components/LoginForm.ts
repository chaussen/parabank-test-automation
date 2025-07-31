import { BaseComponent } from "@core/base/BaseComponent";
import { Locator } from "@playwright/test";

export class LoginForm extends BaseComponent {
    get usernameInput(): Locator {
        return this.locator('input[name="username"]');
    }

    get passwordInput(): Locator {
        return this.locator('input[name="password"]');
    }

    get loginButton(): Locator {
        return this.locator('input[value="Log In"]');
    }

    get registerLink(): Locator {
        return this.getByText('Register', { exact: true });
    }
}
