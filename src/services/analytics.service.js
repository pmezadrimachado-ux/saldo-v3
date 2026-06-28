import { buildAnalyticsSnapshot } from '../domain/analytics/analytics.engine.js';

export function getAnalyticsData(state) {
  return buildAnalyticsSnapshot({
    transactions: state.data.transactions,
    categories: state.data.categories,
    accounts: state.data.accounts,
    budgets: state.data.budgets,
    monthKey: state.session.selectedMonth,
  });
}
