import { EVENT_NAMES } from '../core/constants.js';
import { createLogger } from '../core/logger.js';
import { exportDatabaseSnapshot, openDatabase } from '../storage/indexed-db.adapter.js';
import {
  createInitialMetadata,
  createInitialPreferences,
  createInitialSettings,
} from '../storage/db.seed.js';
import { accountRepository } from '../repositories/account.repository.js';
import { categoryRepository } from '../repositories/category.repository.js';
import { transactionRepository } from '../repositories/transaction.repository.js';
import { budgetRepository } from '../repositories/budget.repository.js';
import { goalRepository } from '../repositories/goal.repository.js';
import { installmentRepository } from '../repositories/installment.repository.js';
import { settingsRepository } from '../repositories/settings.repository.js';
import { preferencesRepository } from '../repositories/preferences.repository.js';
import { metadataRepository } from '../repositories/metadata.repository.js';

const logger = createLogger('StorageService');

export async function initializeStorage(eventBus) {
  await openDatabase();
  await ensureCoreRecords();

  const data = await loadAppData();

  eventBus?.emit(EVENT_NAMES.STATE_CHANGED, {
    source: 'storage:init',
  });

  logger.info('Storage inicializado.');

  return data;
}

export async function ensureCoreRecords() {
  const [settings, preferences, metadata] = await Promise.all([
    settingsRepository.getSettings(),
    preferencesRepository.getPreferences(),
    metadataRepository.getMetadata(),
  ]);

  const tasks = [];

  if (!settings) {
    tasks.push(settingsRepository.saveSettings(createInitialSettings()));
  }

  if (!preferences) {
    tasks.push(preferencesRepository.savePreferences(createInitialPreferences()));
  }

  if (!metadata) {
    tasks.push(metadataRepository.saveMetadata(createInitialMetadata()));
  }

  if (tasks.length) {
    await Promise.all(tasks);
  }
}

export async function loadAppData() {
  await ensureCoreRecords();

  const [
    accounts,
    categories,
    transactions,
    budgets,
    goals,
    installmentGroups,
    settings,
    preferences,
    metadata,
  ] = await Promise.all([
    accountRepository.findAll(),
    categoryRepository.findAll(),
    transactionRepository.findAll(),
    budgetRepository.findAll(),
    goalRepository.findAll(),
    installmentRepository.findAll(),
    settingsRepository.getSettings(),
    preferencesRepository.getPreferences(),
    metadataRepository.getMetadata(),
  ]);

  return {
    accounts,
    categories,
    transactions,
    budgets,
    goals,
    installmentGroups,
    recurrences: [],
    settings,
    preferences,
    metadata,
  };
}

export async function refreshAppData(state) {
  state.data = await loadAppData();
  state.onboarding.completed = Boolean(state.data.settings?.onboardingCompleted);
  return state.data;
}

export async function getStorageSnapshot() {
  return exportDatabaseSnapshot();
}
