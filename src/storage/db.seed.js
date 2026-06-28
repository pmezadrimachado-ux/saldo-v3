import { APP_CONFIG } from '../config/app.config.js';

export function createInitialSettings(now = new Date().toISOString()) {
  return {
    id: 'app_settings',
    currency: APP_CONFIG.currency,
    locale: APP_CONFIG.locale,
    theme: 'dark',
    defaultAccountId: null,
    defaultCategoryId: null,
    onboardingCompleted: false,
    onboardingCompletedAt: null,
    createdAt: now,
    updatedAt: now,
  };
}

export function createInitialPreferences(now = new Date().toISOString()) {
  return {
    id: 'user_preferences',
    quickAddLastAccountId: null,
    quickAddLastCategoryId: null,
    selectedMonth: now.slice(0, 7),
    selectedPeriod: 'month',
    showArchivedItems: false,
    createdAt: now,
    updatedAt: now,
  };
}

export function createInitialMetadata(now = new Date().toISOString()) {
  return {
    id: 'app_metadata',
    appVersion: APP_CONFIG.version,
    schemaVersion: 1,
    installedAt: now,
    lastOpenedAt: now,
    lastBackupAt: null,
    lastImportAt: null,
    createdAt: now,
    updatedAt: now,
  };
}
