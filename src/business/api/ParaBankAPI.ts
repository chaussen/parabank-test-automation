import { APIRequestContext, expect } from "@playwright/test";
import { Logger } from "@core/utils/logger";

// API Response Types
export interface Account {
    id: number;
    customerId: number;
    type: string;
    balance: number;
}

export interface Transaction {
    id: number;
    accountId: number;
    type: string;
    date: number;
    amount: number;
    description: string;
}

export interface BillPaymentResult {
    payeeName: string;
    amount: number;
    accountId: number;
}


export class ParaBankAPI {
    constructor(private request: APIRequestContext) { }

    async findTransactionsByAmount(accountId: string, amount: number) {
        return this.request.get(`/parabank/services_proxy/bank/accounts/${accountId}/transactions/amount/${amount}`, {
            params: { timeout: 30000 }
        });
    }

    async createAccount(customerId: string, newAccountType: number, fromAccountId: string) {
        return this.request.post(`/parabank/services_proxy/bank/createAccount?customerId=${customerId}&newAccountType=${newAccountType}&fromAccountId=${fromAccountId}`);
    }

    async getCustomerAccounts(customerId: string) {
        return this.request.get(`/parabank/services_proxy/bank/customers/${customerId}/accounts`);
    }

    async getAccountDetails(accountId: string) {
        return this.request.get(`/parabank/services_proxy/bank/accounts/${accountId}`);
    }

    async transferFunds(fromAccountId: string, toAccountId: string, amount: string) {
        return this.request.post(`/parabank/services_proxy/bank/transfer?fromAccountId=${fromAccountId}&toAccountId=${toAccountId}&amount=${amount}`);
    }

    async payBill(accountId: string, amount: string, payeeData: {
        name: string;
        address: string;
        city: string;
        state: string;
        zipCode: string;
        phoneNumber: string;
        accountNumber: string;
    }) {
        const url = `/parabank/services_proxy/bank/billpay?accountId=${accountId}&amount=${amount}`;
        
        // Structure payee data as required by API
        const payloadData = {
            address: {
                street: payeeData.address,
                city: payeeData.city,
                state: payeeData.state,
                zipCode: payeeData.zipCode
            },
            name: payeeData.name,
            phoneNumber: payeeData.phoneNumber,
            accountNumber: payeeData.accountNumber
        };
        
        return this.request.post(url, {
            headers: {
                'Content-Type': 'application/json'
            },
            data: JSON.stringify(payloadData)
        });
    }

    async getOverviewPageAndExtractCustomerId(): Promise<string> {
        const response = await this.request.get('/parabank/overview.htm');
        const html = await response.text();
        
        // Look for pattern: "services_proxy/bank/customers/" + 18206 + "/accounts"
        const customerIdMatch = html.match(/services_proxy\/bank\/customers\/" \+ (\d+) \+ "\/accounts/);
        if (customerIdMatch && customerIdMatch[1]) {
            return customerIdMatch[1];
        }
        throw new Error('Could not extract customer ID from overview page');
    }

    async login(username: string, password: string) {
        return this.request.post('/parabank/login.htm', {
            data: { username, password }
        });
    }

    private async makeAuthenticatedRequest(
        url: string, 
        formData: string, 
        successValidations: string[],
        errorMessage: string
    ) {
        const headers = {
            'Content-Type': 'application/x-www-form-urlencoded',
            'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
        };

        // Log the request
        Logger.logApiRequest('POST', url, headers, formData);

        try {
            const response = await this.request.post(url, {
                headers,
                data: formData
            });

            // Log the response
            await Logger.logApiResponse(response);
            const responseText = await response.text();
            
            // Validate success by checking for expected content
            successValidations.forEach(validation => {
                expect(responseText).toContain(validation);
            });
            
            return response;
        } catch (error) {
            Logger.logError(errorMessage, error);
            throw error;
        }
    }

    async loginWithSuccess(username: string, password: string) {
        const formParams = new URLSearchParams({
            'username': username,
            'password': password
        });

        return this.makeAuthenticatedRequest(
            '/parabank/login.htm',
            formParams.toString(),
            [`<li><a href="logout.htm">Log Out</a></li>`, 'Accounts Overview'],
            'Login API call failed'
        );
    }

    async getRegistrationPage() {
        Logger.logApiRequest('GET', '/parabank/register.htm', {}, null);
        const response = await this.request.get('/parabank/register.htm');
        await Logger.logApiResponse(response);
        return response;
    }

    async registerUserWithSuccess(user: {
        firstName: string;
        lastName: string;
        address: string;
        city: string;
        state: string;
        zipCode: string;
        phoneNumber: string;
        ssn: string;
        username: string;
        password: string;
    }) {
        // First, get the registration page to establish session
        console.log('Getting registration page first to establish session...');
        await this.getRegistrationPage();
        const formParams = new URLSearchParams({
            'customer.firstName': user.firstName,
            'customer.lastName': user.lastName,
            'customer.address.street': user.address,
            'customer.address.city': user.city,
            'customer.address.state': user.state,
            'customer.address.zipCode': user.zipCode,
            'customer.phoneNumber': user.phoneNumber,
            'customer.ssn': user.ssn,
            'customer.username': user.username,
            'customer.password': user.password,
            'repeatedPassword': user.password
        });

        return this.makeAuthenticatedRequest(
            '/parabank/register.htm',
            formParams.toString(),
            [`<li><a href="logout.htm">Log Out</a></li>`, `<b>Welcome</b> ${user.firstName} ${user.lastName}</p>`],
            'Registration API call failed'
        );
    }
}