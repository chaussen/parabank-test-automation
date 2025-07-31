# ParaBank Test Automation

E2E test automation framework for ParaBank using Playwright with TypeScript.

## Features

- **UI Tests**: Complete banking workflow testing (registration, login, transfers, bill payments)
- **API Tests**: Pure API testing with proper TypeScript typing
- **Page Object Model**: Component driven with simple data only Page classes
- **Layered Framework**: Three-layered Test Automation Framework
- **TypeScript**: Full type safety with strict ESLint rules
- **Dynamic Data**: Random test data generation and real-time test data extraction

## Setup

```bash
npm install
npx playwright install
```

## Running Tests

```bash
# All tests
npm test

# API tests only (no browser)
npm run test:api

# UI tests only
npm run test:ui

# Specific browsers
npm run test:chromium
npm run test:firefox
npm run test:webkit
```

## Development

```bash
# Lint code
npm run lint

# Type check
npm run typecheck

# View test report
npm run test:report
```

## Architecture

```
src/
├── business/          # Layer 2: Business logic layer
│   ├── api/           # API client and types
│   ├── components/    # Reusable UI components
│   ├── pages/         # Page Object Model
│   └── fixtures/      # Test fixtures
├── core/              # Layer 1: Core utilities
│   ├── base/          # Base classes
│   └── utils/         # Utilities (logger, data generator)
└── tests/
    └── e2e/           # Layer 3: End-to-end tests
        ├── api.spec.ts      # Pure API tests
        ├── banking.spec.ts  # UI banking tests
        └── registration.spec.ts # UI registration tests
```

## Test Categories

- **API Tests**: Headless HTTP requests testing complete banking workflow
- **UI Tests**: Browser-based testing of user interface and interactions
- **Separated execution**: API and UI tests run independently for faster feedback