import { accountRepository } from '../repositories/account.repository.js';
import { transactionRepository } from '../repositories/transaction.repository.js';
import { createAccount } from '../domain/accounts/account.model.js';
import { validateAccount } from '../domain/accounts/account.validators.js';

export async function addAccount(input) {
  const account = createAccount(input);
  const errors = validateAccount(account);

  if (errors.length) {
    throw new Error(errors[0]);
  }

  return accountRepository.save(account);
}

export async function updateAccount(id, input) {
  const existing = await accountRepository.findById(id);

  if (!existing) {
    throw new Error('Conta ou cartão não encontrado.');
  }

  const now = new Date().toISOString();

  const updated = {
    ...existing,
    name: String(input.name ?? existing.name).trim(),
    type: input.type ?? existing.type,
    color: input.color ?? existing.color,
    initialBalance: Number(input.initialBalance ?? existing.initialBalance) || 0,
    creditLimit: input.creditLimit ? Number(input.creditLimit) : existing.creditLimit,
    closingDay: input.closingDay ? Number(input.closingDay) : existing.closingDay,
    dueDay: input.dueDay ? Number(input.dueDay) : existing.dueDay,
    updatedAt: now,
  };

  const errors = validateAccount(updated);

  if (errors.length) {
    throw new Error(errors[0]);
  }

  return accountRepository.save(updated);
}

export async function archiveAccount(id) {
  const existing = await accountRepository.findById(id);

  if (!existing) {
    throw new Error('Conta ou cartão não encontrado.');
  }

  return accountRepository.save({
    ...existing,
    isActive: false,
    archivedAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  });
}

export async function reactivateAccount(id) {
  const existing = await accountRepository.findById(id);

  if (!existing) {
    throw new Error('Conta ou cartão não encontrado.');
  }

  return accountRepository.save({
    ...existing,
    isActive: true,
    archivedAt: null,
    updatedAt: new Date().toISOString(),
  });
}

export async function removeAccountIfUnused(id) {
  const relatedTransactions = await transactionRepository.findByAccount(id);

  if (relatedTransactions.length) {
    return archiveAccount(id);
  }

  return accountRepository.removeById(id);
}
