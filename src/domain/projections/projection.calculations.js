import { roundMoney } from '../../utils/currency.js';

export function buildFutureProjection({
  transactions = [],
  currentMonthKey,
  monthsAhead = 6,
} = {}) {
  const confirmed = transactions.filter((transaction) => (
    transaction.deletedAt === null
    && transaction.status === 'confirmed'
  ));

  const months = getProjectionMonths(currentMonthKey, monthsAhead);

  return months.map((monthKey) => {
    const monthTransactions = confirmed.filter((transaction) => transaction.monthKey === monthKey);
    const income = sum(monthTransactions.filter((transaction) => transaction.type === 'income'));
    const expenses = sum(monthTransactions.filter((transaction) => transaction.type === 'expense'));
    const installmentExpenses = sum(monthTransactions.filter((transaction) => transaction.type === 'expense' && transaction.origin === 'installment'));
    const manualExpenses = sum(monthTransactions.filter((transaction) => transaction.type === 'expense' && transaction.origin !== 'installment'));

    return {
      monthKey,
      income,
      expenses,
      installmentExpenses,
      manualExpenses,
      projectedResult: roundMoney(income - expenses),
      committedAmount: installmentExpenses,
      committedPercentage: expenses > 0 ? roundMoney((installmentExpenses / expenses) * 100) : 0,
    };
  });
}

export function summarizeProjection(projection = []) {
  const totalFutureExpenses = sum(projection.map((item) => ({ amount: item.expenses })));
  const totalInstallments = sum(projection.map((item) => ({ amount: item.installmentExpenses })));
  const worstMonth = [...projection].sort((a, b) => b.expenses - a.expenses)[0] ?? null;
  const bestMonth = [...projection].sort((a, b) => b.projectedResult - a.projectedResult)[0] ?? null;

  return {
    totalFutureExpenses,
    totalInstallments,
    worstMonth,
    bestMonth,
  };
}

function getProjectionMonths(currentMonthKey, count) {
  const [year, month] = currentMonthKey.split('-').map(Number);

  return Array.from({ length: count }, (_, index) => {
    const date = new Date(year, month - 1 + index, 1);
    return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
  });
}

function sum(items) {
  return roundMoney(items.reduce((total, item) => total + Number(item.amount || 0), 0));
}
