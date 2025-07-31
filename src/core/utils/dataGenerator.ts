import { faker } from '@faker-js/faker';

interface PersonalInfo {
    firstName: string;
    lastName: string;
    address: string;
    city: string;
    state: string;
    zipCode: string;
    phoneNumber: string;
}

interface User extends PersonalInfo {
    password: string;
    ssn: string;
    username: string;
}

interface Payee extends PersonalInfo {
    name: string;
    accountNumber: string;
}

function generatePersonalInfo(): PersonalInfo {
    return {
        firstName: faker.person.firstName(),
        lastName: faker.person.lastName(),
        address: faker.location.streetAddress(),
        city: faker.location.city(),
        state: faker.location.state(),
        zipCode: faker.location.zipCode(),
        phoneNumber: faker.phone.number(),
    };
}

export function generateRandomUser(): User {
    const personalInfo = generatePersonalInfo();
    
    // Generate extremely unique username with multiple strategies
    const identifier = faker.string.alphanumeric(10);
    
    // Combine multiple unique elements: testuser_timestamp_processId_randomSuffix_randomNumber
    const username = `user${identifier}`;

    return {
        ...personalInfo,
        password: faker.internet.password({ length: 8 }),
        ssn: faker.number.int({ min: 100000000, max: 999999999 }).toString(),
        username: username
    };
}

export function generateRandomPayee(): Payee {
    const personalInfo = generatePersonalInfo();
    
    return {
        ...personalInfo,
        name: faker.company.name(),
        accountNumber: faker.number.int({ min: 100000000, max: 999999999 }).toString(),
    };
}

export { User, Payee, PersonalInfo };