import { transactionRepository } from '../repositories/transaction.repository.js';
import { preferencesRepository } from '../repositories/preferences.repository.js';
import { createTransaction } from '../domain/transactions/transaction.model.js';
import { validateTransaction } from '../domain/transactions/transaction.validators.js';

export async function addTransaction(input, context = {}) {
  const transaction = createTransaction(input);
  const errors = validateTransaction(transaction, context);

  if (errors.length) {
    throw new Error(errors[0]);
  }

  await transactionRepository.save(transaction);
  await updateQuickAddPreferences(transaction);

  return transaction;
}

export async function updateTransaction(id, input, context = {}) {
  const existing = await transactionRepository.findById(id);

  if (!existing) {
    throw new Error('Lançamento não encontrado.');
  }

  const transaction = createTransaction({
    ...existing,
    ...input,
    id: existing.id,
    createdAt: existing.createdAt,
    deletedAt: existing.deletedAt,
  });

  const errors = validateTransaction(transaction, context);

  if (errors.length) {
    throw new Error(errors[0]);
  }

  return transactionRepository.save(transaction);
}

export async function deleteTransaction(id) {
  const existing = await transactionRepository.findById(id);

  if (!existing) {
    throw new Error('Lançamento não encontrado.');
  }

  return transactionRepository.save({
    ...existing,
    deletedAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  });
}

async function updateQuickAddPreferences(transaction) {
  const preferences = await preferencesRepository.getPreferences();

  if (!preferences) return;

  await preferencesRepository.savePreferences({
    ...preferences,
    quickAddLastAccountId: transaction.accountId,
    quickAddLastCategoryId: transaction.categoryId,
    selectedMonth: transaction.monthKey,
    updatedAt: new Date().toISOString(),
  });
}
