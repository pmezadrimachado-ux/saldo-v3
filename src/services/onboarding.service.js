import { APP_CONFIG } from '../config/app.config.js';
import { accountRepository } from '../repositories/account.repository.js';
import { categoryRepository } from '../repositories/category.repository.js';
import { settingsRepository } from '../repositories/settings.repository.js';
import { preferencesRepository } from '../repositories/preferences.repository.js';
import { metadataRepository } from '../repositories/metadata.repository.js';
import { createAccount } from '../domain/accounts/account.model.js';
import { validateAccount } from '../domain/accounts/account.validators.js';
import { createCategory } from '../domain/categories/category.model.js';
import { validateCategory } from '../domain/categories/category.validators.js';

export const SUGGESTED_ACCOUNTS = [
  { name: 'Nubank', type: 'credit_card', color: '#8B5CF6', icon: 'credit-card' },
  { name: 'Itaú', type: 'checking_account', color: '#FF7A00', icon: 'bank' },
  { name: 'Inter', type: 'checking_account', color: '#FF8A00', icon: 'bank' },
  { name: 'Dinheiro', type: 'cash', color: '#A3FF12', icon: 'cash' },
  { name: 'VR', type: 'benefit', color: '#5BC0FF', icon: 'ticket' },
];

export const SUGGESTED_EXPENSE_CATEGORIES = [
  { name: 'Alimentação', type: 'expense', color: '#FFB86B', icon: 'utensils', sortOrder: 10 },
  { name: 'Mercado', type: 'expense', color: '#A3FF12', icon: 'cart', sortOrder: 20 },
  { name: 'Transporte', type: 'expense', color: '#5BC0FF', icon: 'car', sortOrder: 30 },
  { name: 'Moradia', type: 'expense', color: '#C8CED6', icon: 'home', sortOrder: 40 },
  { name: 'Saúde', type: 'expense', color: '#FF5C5C', icon: 'heart', sortOrder: 50 },
  { name: 'Lazer', type: 'expense', color: '#A78BFA', icon: 'gamepad', sortOrder: 60 },
  { name: 'Assinaturas', type: 'expense', color: '#FFD166', icon: 'repeat', sortOrder: 70 },
  { name: 'Outros', type: 'expense', color: '#6F7D86', icon: 'circle', sortOrder: 999 },
];

export const SUGGESTED_INCOME_CATEGORIES = [
  { name: 'Salário', type: 'income', color: '#A3FF12', icon: 'briefcase', sortOrder: 10 },
  { name: 'Freelance', type: 'income', color: '#5BC0FF', icon: 'laptop', sortOrder: 20 },
  { name: 'Reembolso', type: 'income', color: '#FFD166', icon: 'receipt', sortOrder: 30 },
  { name: 'Outros', type: 'income', color: '#6F7D86', icon: 'circle', sortOrder: 999 },
];

export async function completeOnboarding(input) {
  const now = new Date().toISOString();

  const accounts = input.accounts.map((item) => createAccount(item, now));
  const categories = input.categories.map((item) => createCategory(item, now));

  const errors = [
    ...validateOnboarding(accounts, categories),
    ...accounts.flatMap(validateAccount),
    ...categories.flatMap(validateCategory),
  ];

  if (errors.length) {
    throw new Error(errors[0]);
  }

  await Promise.all(accounts.map((account) => accountRepository.save(account)));
  await Promise.all(categories.map((category) => categoryRepository.save(category)));

  const settings = await settingsRepository.getSettings();
  const preferences = await preferencesRepository.getPreferences();
  const metadata = await metadataRepository.getMetadata();

  const defaultExpenseCategory = categories.find((category) => category.type === 'expense');
  const defaultAccount = accounts[0];

  await settingsRepository.saveSettings({
    ...settings,
    currency: APP_CONFIG.currency,
    locale: APP_CONFIG.locale,
    theme: input.theme ?? 'dark',
    defaultAccountId: defaultAccount.id,
    defaultCategoryId: defaultExpenseCategory?.id ?? null,
    onboardingCompleted: true,
    onboardingCompletedAt: now,
    updatedAt: now,
  });

  await preferencesRepository.savePreferences({
    ...preferences,
    quickAddLastAccountId: defaultAccount.id,
    quickAddLastCategoryId: defaultExpenseCategory?.id ?? null,
    updatedAt: now,
  });

  await metadataRepository.saveMetadata({
    ...metadata,
    appVersion: APP_CONFIG.version,
    lastOpenedAt: now,
    updatedAt: now,
  });

  return {
    accounts,
    categories,
  };
}

function validateOnboarding(accounts, categories) {
  const errors = [];

  if (!accounts.length) {
    errors.push('Adicione pelo menos uma conta ou cartão.');
  }

  if (!categories.some((category) => category.type === 'expense')) {
    errors.push('Selecione pelo menos uma categoria de despesa.');
  }

  if (!categories.some((category) => category.type === 'income')) {
    errors.push('Selecione pelo menos uma categoria de receita.');
  }

  return errors;
}
