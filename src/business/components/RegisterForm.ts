import { BaseComponent } from "@core/base/BaseComponent";
import { User } from "@core/utils/dataGenerator";

export class RegisterForm extends BaseComponent {
    get form() {
        return this.locator('form#customerForm');
    }
    
    get firstNameInput() {
        return this.form.locator('input[name="customer.firstName"]');
    }

    get lastNameInput() {
        return this.form.locator('input[name="customer.lastName"]');
    }

    get addressInput() {
        return this.form.locator('input[name="customer.address.street"]');
    }

    get cityInput() {
        return this.form.locator('input[name="customer.address.city"]');
    }

    get stateInput() {
        return this.form.locator('input[name="customer.address.state"]');
    }

    get zipCodeInput() {
        return this.form.locator('input[name="customer.address.zipCode"]');
    }

    get phoneNumberInput() {
        return this.form.locator('input[name="customer.phoneNumber"]');
    }

    get ssnInput() {
        return this.form.locator('input[name="customer.ssn"]');
    }

    get usernameInput() {
        return this.form.locator('input[name="customer.username"]');
    }

    get passwordInput() {
        return this.form.locator('input[name="customer.password"]');
    }

    get confirmPasswordInput() {
        return this.form.locator('input[name="repeatedPassword"]');
    }

    get registerButton() {
        return this.form.locator('input[value="Register"]');
    }

    async fillAndSubmit(user: User) {
        await this.firstNameInput.fill(user.firstName);
        await this.addressInput.fill(user.address);
        await this.cityInput.fill(user.city);
        await this.stateInput.fill(user.state);
        await this.zipCodeInput.fill(user.zipCode);
        await this.phoneNumberInput.fill(user.phoneNumber);
        await this.ssnInput.fill(user.ssn);
        await this.lastNameInput.fill(user.lastName);
        await this.usernameInput.fill(user.username);
        await this.passwordInput.fill(user.password);
        await this.confirmPasswordInput.fill(user.password);
        // Submit the form directly instead of clicking the button
        await this.form.evaluate((form: HTMLFormElement) => form.submit());
    }
}