import { test as base } from '@playwright/test';
import { BaseFixtures } from '@core/base/BaseFixtures';
export const test = base.extend<BaseFixtures>({})