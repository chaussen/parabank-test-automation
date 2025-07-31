import { generateRandomUser } from '@core/utils/dataGenerator';
import { expect } from '@playwright/test';
import { test } from '@business/fixtures/businessFixtures';

test.describe('ParaBank Registration', () => {
    test('User registration via UI', async ({
        page,
        homePage
    }) => {
        // Increase timeout for this test due to potential captcha
        test.setTimeout(120000);
        
        // Step 1: Navigate to Para bank application
        await page.goto('/parabank/index.htm');
        await expect(page).toHaveTitle(/ParaBank/);

        // Step 2: Create a new user from user registration page
        const user = generateRandomUser();
        await homePage.registerNewUser(user);
        
        // Verify successful registration - test passes if we see welcome message
        await expect(homePage.welcomeTitle.title).toContainText(`Welcome ${user.username}`);
        await expect(homePage.registrationSuccessMessage).toContainText('Your account was created successfully. You are now logged in.');
        
        console.log(`Successfully registered user via UI: ${user.username}`);
    });
});