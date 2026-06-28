import { APP_CONFIG } from '../config/app.config.js';
import { accountRepository } from '../repositories/account.repository.js';
import { categoryRepository } from '../repositories/category.repository.js';
import { settingsRepository } from '../repositories/settings.repository.js';
import { preferencesRepository } from '../repositories/preferences.repository.js';
import { metadataRepository } from '../repositories/metadata.repository.js';
import { createAccount } from '../domain/accounts/account.model.js';
import { uniqueAccounts, uniqueCategories } from '../utils/dedupe.js';
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

export async function completeOnboarding({
  accounts = [],
  categories = [],
  theme = 'dark',
} = {}) {
  const safeAccounts = uniqueAccounts(accounts);
  const safeCategories = uniqueCategories(categories);

  await Promise.all(safeAccounts.map((account) => accountRepository.save(createAccount(account))));
  await Promise.all(safeCategories.map((category) => categoryRepository.save(createCategory(category))));

  const settings = await settingsRepository.getSettings();

  await settingsRepository.saveSettings({
    ...settings,
    onboardingCompleted: true,
    theme,
    updatedAt: new Date().toISOString(),
  });

  return {
    accounts: safeAccounts,
    categories: safeCategories,
  };
}
