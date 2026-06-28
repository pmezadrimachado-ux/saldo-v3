import { isEffectiveTransaction } from '../transactions/transaction.model.js';
import { roundMoney } from '../../utils/currency.js';
import { getTodayInputValue, getWeekKey } from '../../utils/date.js';

const WEEK_LABELS = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];

export function buildAnalyticsSnapshot({
  transactions = [],
  categories = [],
  accounts = [],
  budgets = [],
  monthKey,
  today = getTodayInputValue(),
} = {}) {
  const effectiveTransactions = transactions.filter(isEffectiveTransaction);
  const monthTransactions = effectiveTransactions.filter((transaction) => transaction.monthKey === monthKey);
  const monthExpenses = monthTransactions.filter((transaction) => transaction.type === 'expense');
  const monthIncome = monthTransactions.filter((transaction) => transaction.type === 'income');

  const incomeTotal = sumAmounts(monthIncome);
  const expenseTotal = sumAmounts(monthExpenses);
  const netResult = roundMoney(incomeTotal - expenseTotal);

  const categoryRanking = buildCategoryRanking(monthExpenses, categories);
  const accountRanking = buildAccountRanking(monthTransactions, accounts);
  const weekExpenses = buildWeekdayExpenses(monthExpenses);
  const budgetsStatus = buildBudgetStatus({
    budgets,
    monthKey,
    expenseTotal,
    categoryRanking,
  });

  return {
    monthKey,
    totals: {
      incomeTotal,
      expenseTotal,
      netResult,
      transactionCount: monthTransactions.length,
    },
    categoryRanking,
    accountRanking,
    weekExpenses,
    monthlyEvolution: buildMonthlyEvolution(effectiveTransactions),
    incomeExpenseComparison: buildIncomeExpenseComparison(monthIncome, monthExpenses),
    largestExpenses: buildLargestExpenses(monthExpenses),
    futureCommitment: buildFutureCommitment(effectiveTransactions, monthKey),
    budgetsStatus,
    largestExpense: [...monthExpenses].sort((a, b) => Number(b.amount) - Number(a.amount))[0] ?? null,
    todayExpenses: sumAmounts(effectiveTransactions.filter((transaction) => transaction.type === 'expense' && transaction.date === today)),
    currentWeekExpenses: sumAmounts(effectiveTransactions.filter((transaction) => transaction.type === 'expense' && transaction.weekKey === getWeekKey(today))),
  };
}

function buildCategoryRanking(expenses, categories) {
  const totalExpenses = sumAmounts(expenses);

  return categories
    .map((category) => {
      const total = sumAmounts(expenses.filter((transaction) => transaction.categoryId === category.id));
      const percentage = totalExpenses > 0 ? roundMoney((total / totalExpenses) * 100) : 0;

      return {
        category,
        total,
        percentage,
      };
    })
    .filter((item) => item.total > 0)
    .sort((a, b) => b.total - a.total);
}

function buildAccountRanking(transactions, accounts) {
  return accounts
    .map((account) => {
      const total = sumAmounts(transactions.filter((transaction) => transaction.accountId === account.id && transaction.type === 'expense'));
      const count = transactions.filter((transaction) => transaction.accountId === account.id).length;

      return {
        account,
        total,
        count,
      };
    })
    .filter((item) => item.total > 0 || item.count > 0)
    .sort((a, b) => b.total - a.total);
}

function buildWeekdayExpenses(expenses) {
  const values = Array.from({ length: 7 }, (_, index) => ({
    index,
    label: WEEK_LABELS[index],
    total: 0,
  }));

  expenses.forEach((transaction) => {
    const day = new Date(`${transaction.date}T00:00:00`).getDay();
    values[day].total += Number(transaction.amount);
  });

  return values.map((item) => ({
    ...item,
    total: roundMoney(item.total),
  }));
}

function buildMonthlyEvolution(transactions) {
  const months = [...new Set(transactions.map((transaction) => transaction.monthKey))]
    .sort()
    .slice(-6);

  return months.map((monthKey) => {
    const monthTransactions = transactions.filter((transaction) => transaction.monthKey === monthKey);
    const income = sumAmounts(monthTransactions.filter((transaction) => transaction.type === 'income'));
    const expense = sumAmounts(monthTransactions.filter((transaction) => transaction.type === 'expense'));

    return {
      monthKey,
      income,
      expense,
      result: roundMoney(income - expense),
    };
  });
}

function buildIncomeExpenseComparison(incomeTransactions, expenseTransactions) {
  const income = sumAmounts(incomeTransactions);
  const expense = sumAmounts(expenseTransactions);
  const total = income + expense;

  return {
    income,
    expense,
    incomePercentage: total > 0 ? roundMoney((income / total) * 100) : 0,
    expensePercentage: total > 0 ? roundMoney((expense / total) * 100) : 0,
  };
}

function buildLargestExpenses(expenses) {
  return [...expenses]
    .sort((a, b) => Number(b.amount) - Number(a.amount))
    .slice(0, 5);
}

function buildBudgetStatus({ budgets, monthKey, expenseTotal, categoryRanking }) {
  const activeBudgets = budgets.filter((budget) => budget.isActive && budget.monthKey === monthKey);

  return activeBudgets.map((budget) => {
    const used = budget.type === 'monthly_total'
      ? expenseTotal
      : categoryRanking.find((item) => item.category.id === budget.categoryId)?.total ?? 0;

    const percentage = budget.amount > 0 ? roundMoney((used / budget.amount) * 100) : 0;
    const remaining = roundMoney(Number(budget.amount) - Number(used));
    const status = percentage >= 100 ? 'exceeded' : percentage >= 80 ? 'warning' : 'healthy';

    return {
      budget,
      used: roundMoney(used),
      remaining,
      percentage,
      status,
    };
  });
}

function sumAmounts(items) {
  return roundMoney(items.reduce((sum, item) => sum + Number(item.amount || 0), 0));
}

function buildFutureCommitment(transactions, currentMonthKey) {
  const futureInstallments = transactions
    .filter((transaction) => transaction.type === 'expense')
    .filter((transaction) => transaction.origin === 'installment')
    .filter((transaction) => transaction.monthKey >= currentMonthKey);

  const months = [...new Set(futureInstallments.map((transaction) => transaction.monthKey))]
    .sort()
    .slice(0, 6);

  return months.map((monthKey) => ({
    monthKey,
    total: sumAmounts(futureInstallments.filter((transaction) => transaction.monthKey === monthKey)),
    count: futureInstallments.filter((transaction) => transaction.monthKey === monthKey).length,
  }));
}
