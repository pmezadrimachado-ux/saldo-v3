import { createId } from '../../utils/id.js';
import { addMonthsToDate, getMonthKey, getWeekKey } from '../../utils/date.js';
import { roundMoney } from '../../utils/currency.js';

export function createInstallmentGroup(input, now = new Date().toISOString()) {
  const totalAmount = roundMoney(input.totalAmount);
  const installmentCount = Number(input.installmentCount) || 1;
  const installmentAmount = roundMoney(totalAmount / installmentCount);

  return {
    id: input.id ?? createId('inst'),
    description: String(input.description ?? '').trim(),
    totalAmount,
    installmentCount,
    installmentAmount,
    accountId: input.accountId,
    categoryId: input.categoryId,
    startDate: input.startDate,
    startMonthKey: getMonthKey(input.startDate),
    status: input.status ?? 'active',
    createdTransactionIds: input.createdTransactionIds ?? [],
    createdAt: input.createdAt ?? now,
    updatedAt: now,
    canceledAt: input.canceledAt ?? null,
  };
}

export function generateInstallmentTransactions(group, now = new Date().toISOString()) {
  let accumulated = 0;

  return Array.from({ length: group.installmentCount }, (_, index) => {
    const installmentNumber = index + 1;
    const isLastInstallment = installmentNumber === group.installmentCount;
    const amount = isLastInstallment
      ? roundMoney(group.totalAmount - accumulated)
      : group.installmentAmount;

    accumulated = roundMoney(accumulated + amount);

    const date = addMonthsToDate(group.startDate, index);

    return {
      id: createId('txn'),
      type: 'expense',
      status: 'confirmed',
      origin: 'installment',
      amount,
      description: `${group.description} (${installmentNumber}/${group.installmentCount})`,
      accountId: group.accountId,
      categoryId: group.categoryId,
      date,
      monthKey: getMonthKey(date),
      weekKey: getWeekKey(date),
      notes: '',
      installmentGroupId: group.id,
      installmentNumber,
      installmentTotal: group.installmentCount,
      recurrenceId: null,
      createdAt: now,
      updatedAt: now,
      deletedAt: null,
    };
  });
}
