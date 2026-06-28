import {
  calculateDailyAverage,
  calculateSafeDailyBudget,
  calculateTotalBalance,
  getRecentTransactions,
} from '../domain/finance/finance.calculations.js';
import { generateDashboardInsights } from '../domain/analytics/insights.js';
import { getAnalyticsData } from './analytics.service.js';

export function getDashboardData(state) {
  const analytics = getAnalyticsData(state);
  const monthlySummary = analytics.totals;
  const dailyAverage = calculateDailyAverage(monthlySummary.expenseTotal, state.session.selectedMonth);
  const safeDailyBudget = calculateSafeDailyBudget(monthlySummary.incomeTotal, monthlySummary.expenseTotal, state.session.selectedMonth);

  const data = {
    totalBalance: calculateTotalBalance(state.data.accounts, state.data.transactions),
    monthlySummary,
    todayExpenses: analytics.todayExpenses,
    weekExpenses: analytics.currentWeekExpenses,
    categoryRanking: analytics.categoryRanking,
    topCategory: analytics.categoryRanking[0] ?? null,
    largestExpense: analytics.largestExpense,
    dailyAverage,
    safeDailyBudget,
    recentTransactions: getRecentTransactions(state.data.transactions, 5),
    budgetsStatus: analytics.budgetsStatus,
    weekExpensesByDay: analytics.weekExpenses,
    monthlyEvolution: analytics.monthlyEvolution,
    futureCommitment: analytics.futureCommitment,
  };

  return {
    ...data,
    insights: generateDashboardInsights({
      ...data,
      weekExpenses: data.weekExpenses,
      weekExpensesByDay: analytics.weekExpenses,
      monthlyEvolution: analytics.monthlyEvolution,
    futureCommitment: analytics.futureCommitment,
    }),
  };
}
