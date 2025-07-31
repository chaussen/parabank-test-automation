import * as fs from 'fs';
import * as path from 'path';

export class Logger {
    private static logFilePath = path.join(process.cwd(), 'debug.log');

    private static writeToFile(content: string) {
        const timestamp = new Date().toISOString();
        const logEntry = `[${timestamp}] ${content}\n`;

        try {
            fs.appendFileSync(this.logFilePath, logEntry);
        } catch (error) {
            console.error('Failed to write to log file:', error);
        }
    }

    private static logToFileOnly(content: string) {
        this.writeToFile(content);
    }

    static logApiRequest(method: string, url: string, headers?: any, data?: any) {
        // Log summary to console
        const consoleSummary = `API ${method.toUpperCase()} ${url}`;
        console.log(consoleSummary);

        // Log full details to file only
        const fileContent = [
            '=== API REQUEST ===',
            `Method: ${method.toUpperCase()}`,
            `URL: ${url}`,
            headers ? `Headers: ${JSON.stringify(headers, null, 2)}` : '',
            data ? `Data: ${typeof data === 'string' ? data : JSON.stringify(data, null, 2)}` : '',
            '=================='
        ].filter(Boolean).join('\n');

        this.logToFileOnly(fileContent);
    }

    static async logApiResponse(response: any) {
        try {
            const responseText = await response.text();

            const consoleSummary = `API Response: ${response.status()} ${response.statusText()}`;
            console.log(consoleSummary);

            const fileContent = [
                '=== API RESPONSE ===',
                `Status: ${response.status()}`,
                `Status Text: ${response.statusText()}`,
                `OK: ${response.ok()}`,
                `Headers: ${JSON.stringify(response.headers(), null, 2)}`,
                `Response Body: ${responseText}`,
                '==================='
            ].join('\n');

            this.logToFileOnly(fileContent);
        } catch (error) {
            const consoleSummary = `API Response: ${response.status()} ${response.statusText()} (body read error)`;
            console.log(consoleSummary);

            const fileContent = [
                '=== API RESPONSE ===',
                `Status: ${response.status()}`,
                `Status Text: ${response.statusText()}`,
                `OK: ${response.ok()}`,
                `Headers: ${JSON.stringify(response.headers(), null, 2)}`,
                `Could not read response body: ${error}`,
                '==================='
            ].join('\n');

            this.logToFileOnly(fileContent);
        }
    }

    static logError(message: string, error?: any) {
        console.log(`ERROR: ${message}`);

        const fileContent = [
            '=== ERROR ===',
            `Message: ${message}`,
            error ? `Error: ${error}` : '',
            '============='
        ].filter(Boolean).join('\n');

        this.logToFileOnly(fileContent);
    }

    static logUserCredentials(username: string, password: string, action: string) {
        console.log(`${action}: ${username}`);

        const fileContent = [
            '=== USER CREDENTIALS ===',
            `Action: ${action}`,
            `Username: ${username}`,
            `Password: ${password}`,
            '======================='
        ].join('\n');

        this.logToFileOnly(fileContent);
    }

    static logTestStep(step: string, details?: any) {
        console.log(`TEST: ${step}`);

        const fileContent = [
            '=== TEST STEP ===',
            `Step: ${step}`,
            details ? `Details: ${typeof details === 'string' ? details : JSON.stringify(details, null, 2)}` : '',
            '================'
        ].filter(Boolean).join('\n');

        this.logToFileOnly(fileContent);
    }

    static logSensitiveData(title: string, data: any) {
        console.log(title);

        const fileContent = [
            `=== ${title.toUpperCase()} ===`,
            typeof data === 'string' ? data : JSON.stringify(data, null, 2),
            '='.repeat(title.length + 8)
        ].join('\n');

        this.logToFileOnly(fileContent);
    }

    static clearLogFile() {
        try {
            fs.writeFileSync(this.logFilePath, '');
        } catch (error) {
            console.error('Failed to clear log file:', error);
        }
    }
}