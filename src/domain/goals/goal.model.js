import { createId } from '../../utils/id.js';

export function createGoal(input, now = new Date().toISOString()) {
  return {
    id: input.id ?? createId('goal'),
    name: String(input.name ?? '').trim(),
    targetAmount: Number(input.targetAmount) || 0,
    currentAmount: Number(input.currentAmount) || 0,
    targetDate: input.targetDate || null,
    color: input.color || '#A3FF12',
    icon: input.icon || 'target',
    status: input.status || 'active',
    createdAt: input.createdAt ?? now,
    updatedAt: now,
    archivedAt: input.archivedAt ?? null,
  };
}
