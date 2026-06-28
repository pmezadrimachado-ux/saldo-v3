import { createId } from '../../utils/id.js';
import { getMonthKey, getWeekKey } from '../../utils/date.js';
import { roundMoney } from '../../utils/currency.js';

export function createTransaction(input, now = new Date().toISOString()) {
  const date = input.date;

  return {
    id: input.id ?? createId('txn'),
    type: input.type ?? 'expense',
    status: input.status ?? 'confirmed',
    origin: input.origin ?? 'manual',

    amount: roundMoney(input.amount),
    description: String(input.description ?? '').trim(),

    accountId: input.accountId,
    categoryId: input.categoryId,

    date,
    monthKey: getMonthKey(date),
    weekKey: getWeekKey(date),

    notes: String(input.notes ?? '').trim(),

    installmentGroupId: input.installmentGroupId ?? null,
    installmentNumber: input.installmentNumber ?? null,
    installmentTotal: input.installmentTotal ?? null,

    recurrenceId: input.recurrenceId ?? null,

    createdAt: input.createdAt ?? now,
    updatedAt: now,
    deletedAt: input.deletedAt ?? null,
  };
}

export function isEffectiveTransaction(transaction) {
  return transaction.deletedAt === null && transaction.status === 'confirmed';
}
