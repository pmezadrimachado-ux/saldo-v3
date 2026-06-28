import { APP_CONFIG } from '../../config/app.config.js';
import { ROUTES } from '../../core/constants.js';
import { createLogger } from '../../core/logger.js';
import { renderBottomNavigation } from '../components/bottom-navigation.component.js';
import { renderErrorState } from '../components/error-state.component.js';
import { renderToast } from '../components/toast.component.js';
import { renderAccountsPage } from '../pages/accounts.page.js';
import { renderAnalyticsPage } from '../pages/analytics.page.js';
import { renderBudgetsPage } from '../pages/budgets.page.js';
import { renderCategoriesPage } from '../pages/categories.page.js';
import { renderDashboardPage } from '../pages/dashboard.page.js';
import { renderGoalsPage } from '../pages/goals.page.js';
import { renderInstallmentsPage } from '../pages/installments.page.js';
import { renderBackupPage } from '../pages/backup.page.js';
import { renderPwaPage } from '../pages/pwa.page.js';
import { renderTestsPage } from '../pages/tests.page.js';
import { renderOnboardingPage } from '../pages/onboarding.page.js';
import { renderQuickAddPage } from '../pages/quick-add.page.js';
import { renderSettingsPage } from '../pages/settings.page.js';
import { renderTransactionsPage } from '../pages/transactions.page.js';
const logger = createLogger('AppShell');
const PAGE_RENDERERS = { [ROUTES.ONBOARDING]: renderOnboardingPage, [ROUTES.QUICK_ADD]: renderQuickAddPage, [ROUTES.DASHBOARD]: renderDashboardPage, [ROUTES.TRANSACTIONS]: renderTransactionsPage, [ROUTES.ANALYTICS]: renderAnalyticsPage, [ROUTES.SETTINGS]: renderSettingsPage, [ROUTES.ACCOUNTS]: renderAccountsPage, [ROUTES.CATEGORIES]: renderCategoriesPage, [ROUTES.BUDGETS]: renderBudgetsPage, [ROUTES.GOALS]: renderGoalsPage };
export function renderAppShell(rootElement, context) {
  const { state } = context;
  rootElement.innerHTML = `<div class="app-shell"><a class="skip-link" href="#main-content">Pular para o conteúdo</a><header class="app-header"><div><p class="app-header__eyebrow">${APP_CONFIG.version}</p><h1 class="app-header__title">${APP_CONFIG.name}</h1></div><div class="app-header__status">${state.app.isOffline ? 'Offline' : 'Online'}</div></header><main class="app-main" id="main-content" tabindex="-1">${renderCurrentPageSafely(context)}</main>${renderBottomNavigation(state)}${renderToast(state.ui.toast)}</div>`;
}
function renderCurrentPageSafely(context) {
  const { state } = context;
  try { const renderer = PAGE_RENDERERS[state.route.current] ?? PAGE_RENDERERS[ROUTES.QUICK_ADD]; return renderer(context); }
  catch (error) { logger.error('Erro ao renderizar página.', error); state.ui.lastError = error; return renderErrorState({ title: 'Não foi possível abrir esta tela', description: 'A tela encontrou um erro controlado. O aplicativo continua funcionando.' }); }
}
