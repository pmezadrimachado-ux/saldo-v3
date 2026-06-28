import { budgetRepository } from '../repositories/budget.repository.js';
import { createBudget } from '../domain/budgets/budget.model.js';
import { validateBudget } from '../domain/budgets/budget.validators.js';

export async function addBudget(input) {
  const budget = createBudget(input);
  const errors = validateBudget(budget);

  if (errors.length) {
    throw new Error(errors[0]);
  }

  return budgetRepository.save(budget);
}

export async function updateBudget(id, input) {
  const existing = await budgetRepository.findById(id);

  if (!existing) {
    throw new Error('Orçamento não encontrado.');
  }

  const budget = createBudget({
    ...existing,
    ...input,
    id: existing.id,
    createdAt: existing.createdAt,
  });

  const errors = validateBudget(budget);

  if (errors.length) {
    throw new Error(errors[0]);
  }

  return budgetRepository.save(budget);
}

export async function archiveBudget(id) {
  const existing = await budgetRepository.findById(id);

  if (!existing) {
    throw new Error('Orçamento não encontrado.');
  }

  return budgetRepository.save({
    ...existing,
    isActive: false,
    updatedAt: new Date().toISOString(),
  });
}
