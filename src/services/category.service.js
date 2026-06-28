import { categoryRepository } from '../repositories/category.repository.js';
import { transactionRepository } from '../repositories/transaction.repository.js';
import { createCategory } from '../domain/categories/category.model.js';
import { validateCategory } from '../domain/categories/category.validators.js';

export async function addCategory(input) {
  const category = createCategory(input);
  const errors = validateCategory(category);

  if (errors.length) {
    throw new Error(errors[0]);
  }

  return categoryRepository.save(category);
}

export async function updateCategory(id, input) {
  const existing = await categoryRepository.findById(id);

  if (!existing) {
    throw new Error('Categoria não encontrada.');
  }

  const updated = {
    ...existing,
    name: String(input.name ?? existing.name).trim(),
    type: input.type ?? existing.type,
    color: input.color ?? existing.color,
    icon: input.icon ?? existing.icon,
    sortOrder: Number(input.sortOrder ?? existing.sortOrder) || existing.sortOrder,
    updatedAt: new Date().toISOString(),
  };

  const errors = validateCategory(updated);

  if (errors.length) {
    throw new Error(errors[0]);
  }

  return categoryRepository.save(updated);
}

export async function archiveCategory(id) {
  const existing = await categoryRepository.findById(id);

  if (!existing) {
    throw new Error('Categoria não encontrada.');
  }

  return categoryRepository.save({
    ...existing,
    isActive: false,
    archivedAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  });
}

export async function reactivateCategory(id) {
  const existing = await categoryRepository.findById(id);

  if (!existing) {
    throw new Error('Categoria não encontrada.');
  }

  return categoryRepository.save({
    ...existing,
    isActive: true,
    archivedAt: null,
    updatedAt: new Date().toISOString(),
  });
}

export async function removeCategoryIfUnused(id) {
  const relatedTransactions = await transactionRepository.findByCategory(id);

  if (relatedTransactions.length) {
    return archiveCategory(id);
  }

  return categoryRepository.removeById(id);
}
