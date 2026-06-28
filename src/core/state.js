import { APP_CONFIG } from '../config/app.config.js';
import { ROUTES } from './constants.js';

export function createInitialState() {
  return {
    app: {
      name: APP_CONFIG.name,
      version: APP_CONFIG.version,
      isReady: false,
      isOffline: !navigator.onLine,
    },

    route: {
      current: window.location.hash || APP_CONFIG.defaultRoute,
      previous: null,
      params: {},
    },

    session: {
      selectedMonth: new Date().toISOString().slice(0, 7),
      selectedPeriod: 'month',
    },

    data: {
      accounts: [],
      categories: [],
      transactions: [],
      budgets: [],
      goals: [],
      settings: null,
      preferences: null,
      metadata: null,
    },

    ui: {
      isLoading: false,
      toast: null,
      toastTimer: null,
      modal: null,
      bottomSheet: null,
      lastError: null,
    },

    onboarding: {
      completed: false,
      currentStep: 'welcome',
    },
  };
}

export function setAppReady(state, isReady = true) {
  state.app.isReady = isReady;
  return state;
}

export function setOfflineStatus(state, isOffline) {
  state.app.isOffline = isOffline;
  return state;
}

export function setRoute(state, route) {
  state.route.previous = state.route.current;
  state.route.current = route || ROUTES.QUICK_ADD;
  return state;
}

export function setToast(state, toast) {
  state.ui.toast = toast;
  return state;
}

export function setLastError(state, error) {
  state.ui.lastError = error;
  return state;
}

export function clearToastTimer(state) {
  if (state.ui.toastTimer) {
    window.clearTimeout(state.ui.toastTimer);
    state.ui.toastTimer = null;
  }

  return state;
}
