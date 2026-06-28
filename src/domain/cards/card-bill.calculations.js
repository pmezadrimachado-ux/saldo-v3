import { roundMoney } from '../../utils/currency.js';

export function buildCardBillSummary({
  accounts = [],
  transactions = [],
  monthKey,
} = {}) {
  const creditCards = accounts.filter((account) => account.type === 'credit_card');
  const activeTransactions = transactions.filter((transaction) => transaction.deletedAt === null && transaction.status === 'confirmed');

  return creditCards.map((card) => {
    const billTransactions = activeTransactions
      .filter((transaction) => transaction.accountId === card.id)
      .filter((transaction) => transaction.type === 'expense')
      .filter((transaction) => transaction.monthKey === monthKey);

    const total = roundMoney(billTransactions.reduce((sum, transaction) => sum + Number(transaction.amount), 0));
    const limit = Number(card.creditLimit || 0);
    const available = limit > 0 ? roundMoney(limit - total) : null;
    const usedPercentage = limit > 0 ? roundMoney((total / limit) * 100) : 0;

    return {
      card,
      monthKey,
      total,
      transactionCount: billTransactions.length,
      closingDay: card.closingDay ?? null,
      dueDay: card.dueDay ?? null,
      limit,
      available,
      usedPercentage,
      transactions: billTransactions,
      status: usedPercentage >= 100 ? 'exceeded' : usedPercentage >= 80 ? 'warning' : 'healthy',
    };
  });
}

export function buildInstallmentsByCard({
  accounts = [],
  transactions = [],
  monthKey,
} = {}) {
  const creditCards = accounts.filter((account) => account.type === 'credit_card');
  const installmentTransactions = transactions
    .filter((transaction) => transaction.deletedAt === null && transaction.status === 'confirmed')
    .filter((transaction) => transaction.origin === 'installment')
    .filter((transaction) => transaction.monthKey >= monthKey);

  return creditCards.map((card) => {
    const cardInstallments = installmentTransactions.filter((transaction) => transaction.accountId === card.id);
    const totalFuture = roundMoney(cardInstallments.reduce((sum, transaction) => sum + Number(transaction.amount), 0));
    const currentMonthTotal = roundMoney(cardInstallments.filter((transaction) => transaction.monthKey === monthKey).reduce((sum, transaction) => sum + Number(transaction.amount), 0));

    return {
      card,
      totalFuture,
      currentMonthTotal,
      count: cardInstallments.length,
    };
  }).filter((item) => item.totalFuture > 0 || item.currentMonthTotal > 0);
}
