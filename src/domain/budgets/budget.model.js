import { createId } from '../../utils/id.js';

export function createBudget(input, now = new Date().toISOString()) {
  return {
    id: input.id ?? createId('bud'),
    type: input.type ?? 'monthly_total',
    monthKey: input.monthKey,
    amount: Number(input.amount) || 0,
    categoryId: input.categoryId || null,
    isActive: input.isActive ?? true,
    createdAt: input.createdAt ?? now,
    updatedAt: now,
  };
}
