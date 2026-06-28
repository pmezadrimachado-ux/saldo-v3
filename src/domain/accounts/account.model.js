import { createId } from '../../utils/id.js';

export function createAccount(input, now = new Date().toISOString()) {
  return {
    id: input.id ?? createId('acc'),
    name: String(input.name ?? '').trim(),
    type: input.type ?? 'checking_account',
    color: input.color ?? '#A3FF12',
    icon: input.icon ?? 'wallet',
    initialBalance: Number(input.initialBalance) || 0,
    creditLimit: input.creditLimit ? Number(input.creditLimit) : null,
    closingDay: input.closingDay ? Number(input.closingDay) : null,
    dueDay: input.dueDay ? Number(input.dueDay) : null,
    isActive: true,
    archivedAt: null,
    createdAt: now,
    updatedAt: now,
  };
}
