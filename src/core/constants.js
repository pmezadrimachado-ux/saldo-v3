export const ROUTES = {
  ONBOARDING: '#/onboarding', QUICK_ADD: '#/quick-add', DASHBOARD: '#/dashboard', TRANSACTIONS: '#/transactions',
  ANALYTICS: '#/analytics', SETTINGS: '#/settings', ACCOUNTS: '#/accounts', CATEGORIES: '#/categories', BUDGETS: '#/budgets', GOALS: '#/goals',
};
export const MAIN_NAV_ROUTES = [ROUTES.QUICK_ADD, ROUTES.DASHBOARD, ROUTES.TRANSACTIONS, ROUTES.ANALYTICS, ROUTES.SETTINGS];
export const ROUTE_LABELS = {
  [ROUTES.ONBOARDING]: 'Onboarding', [ROUTES.QUICK_ADD]: 'Lançar', [ROUTES.DASHBOARD]: 'Dashboard', [ROUTES.TRANSACTIONS]: 'Transações',
  [ROUTES.ANALYTICS]: 'Análises', [ROUTES.SETTINGS]: 'Ajustes', [ROUTES.ACCOUNTS]: 'Contas', [ROUTES.CATEGORIES]: 'Categorias', [ROUTES.BUDGETS]: 'Orçamentos', [ROUTES.GOALS]: 'Metas',
  [ROUTES.INSTALLMENTS]: 'Parcelamentos',
  [ROUTES.BACKUP]: 'Backup',
  [ROUTES.PWA]: 'PWA',
  [ROUTES.TESTS]: 'Testes',
};
export const EVENT_NAMES = {
  APP_READY: 'app:ready', ROUTE_CHANGED: 'route:changed', STATE_CHANGED: 'state:changed', TOAST_SHOW: 'toast:show', TOAST_CLEAR: 'toast:clear', ERROR_CAPTURED: 'error:captured',
};
