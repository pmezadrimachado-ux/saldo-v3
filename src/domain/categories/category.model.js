import { createId } from '../../utils/id.js';

export function createCategory(input, now = new Date().toISOString()) {
  return {
    id: input.id ?? createId('cat'),
    name: String(input.name ?? '').trim(),
    type: input.type ?? 'expense',
    color: input.color ?? '#A3FF12',
    icon: input.icon ?? 'circle',
    sortOrder: Number(input.sortOrder) || 100,
    isSystem: false,
    isActive: true,
    archivedAt: null,
    createdAt: now,
    updatedAt: now,
  };
}
