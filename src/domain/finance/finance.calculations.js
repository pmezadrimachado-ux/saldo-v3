import { isEffectiveTransaction } from '../transactions/transaction.model.js';
import { roundMoney } from '../../utils/currency.js';
import { getMonthKey, getTodayInputValue, getWeekKey } from '../../utils/date.js';

export function calculateMonthlySummary(transactions = [], monthKey) {
  const effective = transactions.filter(isEffectiveTransaction).filter((transaction) => transaction.monthKey === monthKey);
  const incomeTotal = effective.filter((transaction) => transaction.type === 'income').reduce((sum, transaction) => sum + Number(transaction.amount), 0);
  const expenseTotal = effective.filter((transaction) => transaction.type === 'expense').reduce((sum, transaction) => sum + Number(transaction.amount), 0);
  return { incomeTotal: roundMoney(incomeTotal), expenseTotal: roundMoney(expenseTotal), netResult: roundMoney(incomeTotal - expenseTotal), transactionCount: effective.length };
}

export function calculateTotalBalance(accounts = [], transactions = []) {
  const effective = transactions.filter(isEffectiveTransaction);
  return roundMoney(accounts.reduce((total, account) => {
    const movement = effective.filter((transaction) => transaction.accountId === account.id).reduce((sum, transaction) => {
      if (transaction.type === 'income') return sum + Number(transaction.amount);
      if (transaction.type === 'expense') return sum - Number(transaction.amount);
      return sum;
    }, 0);
    return total + Number(account.initialBalance || 0) + movement;
  }, 0));
}

export function calculateTodayExpenses(transactions = [], today = getTodayInputValue()) {
  return roundMoney(transactions.filter(isEffectiveTransaction).filter((t) => t.type === 'expense' && t.date === today).reduce((sum, t) => sum + Number(t.amount), 0));
}

export function calculateWeekExpenses(transactions = [], weekKey = getWeekKey(getTodayInputValue())) {
  return roundMoney(transactions.filter(isEffectiveTransaction).filter((t) => t.type === 'expense' && t.weekKey === weekKey).reduce((sum, t) => sum + Number(t.amount), 0));
}

export function calculateExpensesByCategory(transactions = [], categories = [], monthKey = getMonthKey(getTodayInputValue())) {
  const monthlyExpenses = transactions.filter(isEffectiveTransaction).filter((t) => t.type === 'expense' && t.monthKey === monthKey);
  return categories.map((category) => {
    const total = monthlyExpenses.filter((t) => t.categoryId === category.id).reduce((sum, t) => sum + Number(t.amount), 0);
    return { category, total: roundMoney(total) };
  }).filter((item) => item.total > 0).sort((a, b) => b.total - a.total);
}

export function getLargestExpense(transactions = [], monthKey = getMonthKey(getTodayInputValue())) {
  return transactions.filter(isEffectiveTransaction).filter((t) => t.type === 'expense' && t.monthKey === monthKey).sort((a, b) => Number(b.amount) - Number(a.amount))[0] ?? null;
}

export function calculateDailyAverage(expenseTotal, monthKey) {
  const now = new Date();
  const [year, month] = monthKey.split('-').map(Number);
  const isCurrentMonth = now.getFullYear() === year && now.getMonth() + 1 === month;
  const elapsedDays = isCurrentMonth ? now.getDate() : new Date(year, month, 0).getDate();
  return roundMoney((Number(expenseTotal) || 0) / Math.max(elapsedDays, 1));
}

export function calculateSafeDailyBudget(incomeTotal, expenseTotal, monthKey) {
  const now = new Date();
  const [year, month] = monthKey.split('-').map(Number);
  const isCurrentMonth = now.getFullYear() === year && now.getMonth() + 1 === month;
  const daysInMonth = new Date(year, month, 0).getDate();
  const elapsedDays = isCurrentMonth ? now.getDate() : daysInMonth;
  const remainingDays = Math.max(daysInMonth - elapsedDays, 0);
  const available = Math.max((Number(incomeTotal) || 0) - (Number(expenseTotal) || 0), 0);
  return roundMoney(remainingDays > 0 ? available / remainingDays : available);
}

export function getRecentTransactions(transactions = [], limit = 5) {
  return transactions.filter((t) => t.deletedAt === null).sort((a, b) => b.date.localeCompare(a.date) || b.createdAt.localeCompare(a.createdAt)).slice(0, limit);
}
