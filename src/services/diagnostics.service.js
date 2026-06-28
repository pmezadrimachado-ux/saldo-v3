import { APP_CONFIG } from '../config/app.config.js';

export function getDiagnostics(state) {
  const transactionCount = state.data.transactions.length;
  const accountCount = state.data.accounts.length;
  const categoryCount = state.data.categories.length;
  const budgetCount = state.data.budgets.length;
  const goalCount = state.data.goals.length;
  const installmentCount = state.data.installmentGroups.length;

  return {
    appVersion: APP_CONFIG.version,
    environment: APP_CONFIG.environment,
    online: navigator.onLine,
    serviceWorkerSupported: 'serviceWorker' in navigator,
    indexedDbSupported: 'indexedDB' in window,
    standalone: window.matchMedia('(display-mode: standalone)').matches || navigator.standalone === true,
    counts: {
      accounts: accountCount,
      categories: categoryCount,
      transactions: transactionCount,
      budgets: budgetCount,
      goals: goalCount,
      installmentGroups: installmentCount,
    },
    estimatedComplexity: getComplexityLabel({
      transactionCount,
      accountCount,
      categoryCount,
      budgetCount,
      goalCount,
      installmentCount,
    }),
  };
}

function getComplexityLabel(counts) {
  const score =
    counts.transactionCount
    + counts.accountCount * 5
    + counts.categoryCount * 5
    + counts.budgetCount * 3
    + counts.goalCount * 3
    + counts.installmentCount * 8;

  if (score > 10000) return 'alto';
  if (score > 1000) return 'médio';

  return 'baixo';
}
