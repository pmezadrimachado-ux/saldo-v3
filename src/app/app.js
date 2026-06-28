import { APP_CONFIG } from '../config/app.config.js';
import { EVENT_NAMES, ROUTES } from '../core/constants.js';
import { createEventBus } from '../core/event-bus.js';
import { createLogger } from '../core/logger.js';
import { createRouter } from '../core/router.js';
import {
  clearToastTimer,
  createInitialState,
  setAppReady,
  setLastError,
  setOfflineStatus,
  setRoute,
  setToast,
} from '../core/state.js';
import { parseCurrencyInput } from '../utils/currency.js';
import { addBudget } from '../services/budget.service.js';
import { addGoal, archiveGoal, reactivateGoal, updateGoal } from '../services/goal.service.js';
import { addInstallmentGroup } from '../services/installment.service.js';
import { exportBackupFile, importBackupFile } from '../services/backup.service.js';
import { registerServiceWorker } from '../services/pwa.service.js';
import { watchForPwaUpdates } from '../services/pwa-update.service.js';
import { initializeStorage, refreshAppData } from '../services/storage.service.js';
import { completeOnboarding } from '../services/onboarding.service.js';
import {
  addAccount,
  archiveAccount,
  reactivateAccount,
  updateAccount,
} from '../services/account.service.js';
import {
  addCategory,
  archiveCategory,
  reactivateCategory,
  updateCategory,
} from '../services/category.service.js';
import {
  addTransaction,
  deleteTransaction,
  updateTransaction,
} from '../services/transaction.service.js';
import { renderAppShell } from '../ui/layouts/app-shell.layout.js';

const logger = createLogger('App');

export async function initializeApp() {
  const rootElement = document.querySelector(APP_CONFIG.rootSelector);

  if (!rootElement) {
    throw new Error(`Elemento raiz não encontrado: ${APP_CONFIG.rootSelector}`);
  }

  const state = createInitialState();
  const eventBus = createEventBus();

  const render = () => {
    renderAppShell(rootElement, {
      state,
      eventBus,
      router,
    });

    bindGlobalEvents(rootElement, {
      state,
      eventBus,
      router,
      render,
    });
  };

  const router = createRouter({
    state,
    eventBus,
    setRoute,
  });

  eventBus.on(EVENT_NAMES.ROUTE_CHANGED, () => {
    render();
  });

  eventBus.on(EVENT_NAMES.TOAST_SHOW, ({ toast }) => {
    showToast(state, render, toast);
  });

  eventBus.on(EVENT_NAMES.TOAST_CLEAR, () => {
    clearToastTimer(state);
    setToast(state, null);
    render();
  });

  window.addEventListener('online', () => {
    setOfflineStatus(state, false);
    showToast(state, render, {
      type: 'success',
      message: 'Conexão restabelecida.',
    });
  });

  window.addEventListener('offline', () => {
    setOfflineStatus(state, true);
    showToast(state, render, {
      type: 'info',
      message: 'Você está offline. O app continua funcionando.',
    });
  });

  render();

  await registerServiceWorker();
  watchForPwaUpdates(eventBus);

  try {
    state.data = await initializeStorage(eventBus);
    state.onboarding.completed = Boolean(state.data.settings?.onboardingCompleted);
  } catch (error) {
    logger.error('Falha ao inicializar storage.', error);
    setLastError(state, error);
    showToast(state, render, {
      type: 'error',
      message: 'Não foi possível iniciar o banco local.',
    });
  }

  setAppReady(state, true);

  router.start();

  if (!state.onboarding.completed) {
    router.navigate(ROUTES.ONBOARDING, { replace: true });
  } else if (!window.location.hash) {
    router.navigate(ROUTES.QUICK_ADD, { replace: true });
  }

  eventBus.emit(EVENT_NAMES.APP_READY, {
    version: state.app.version,
  });

  render();

  logger.info('Aplicação inicializada.');
}

function bindGlobalEvents(rootElement, { state, router, render }) {
  rootElement.querySelectorAll('[data-route]').forEach((element) => {
    element.addEventListener('click', (event) => {
      event.preventDefault();

      const route = element.dataset.route;

      try {
        router.navigate(route);
      } catch (error) {
        setLastError(state, error);
        render();
      }
    });
  });

  bindOnboardingForm(rootElement, state, router, render);
  bindAccountActions(rootElement, state, render);
  bindCategoryActions(rootElement, state, render);
  bindTransactionActions(rootElement, state, render);
  bindBudgetActions(rootElement, state, render);
  bindGoalActions(rootElement, state, render);
  bindInstallmentActions(rootElement, state, render);
  bindBackupActions(rootElement, state, render);

  rootElement.querySelector('[data-dismiss-toast]')?.addEventListener('click', () => {
    clearToastTimer(state);
    setToast(state, null);
    render();
  });
}





function bindBackupActions(rootElement, state, render) {
  rootElement.querySelector('[data-export-backup]')?.addEventListener('click', async () => {
    try {
      await exportBackupFile();
      showToast(state, render, { type: 'success', message: 'Backup exportado.' });
    } catch (error) {
      showToast(state, render, { type: 'error', message: error.message || 'Não foi possível exportar backup.' });
    }
  });

  rootElement.querySelector('[data-import-backup-form]')?.addEventListener('submit', async (event) => {
    event.preventDefault();

    const file = event.currentTarget.backupFile.files[0];

    if (!file) {
      showToast(state, render, { type: 'error', message: 'Selecione um arquivo de backup.' });
      return;
    }

    const confirmed = window.confirm('Importar este backup substituirá todos os dados atuais. Deseja continuar?');

    if (!confirmed) return;

    try {
      await importBackupFile(file);
      await refreshAppData(state);
      showToast(state, render, { type: 'success', message: 'Backup importado.' });
    } catch (error) {
      showToast(state, render, { type: 'error', message: error.message || 'Não foi possível importar backup.' });
    }
  });
}

function bindInstallmentActions(rootElement, state, render) {
  rootElement.querySelector('[data-installment-form]')?.addEventListener('submit', async (event) => {
    event.preventDefault();

    const data = Object.fromEntries(new FormData(event.currentTarget));

    try {
      await addInstallmentGroup({
        ...data,
        totalAmount: parseCurrencyInput(data.totalAmount),
        installmentCount: Number(data.installmentCount),
      });

      event.currentTarget.reset();
      await refreshAppData(state);
      showToast(state, render, { type: 'success', message: 'Parcelas geradas.' });
    } catch (error) {
      showToast(state, render, { type: 'error', message: error.message || 'Não foi possível gerar parcelas.' });
    }
  });
}

function bindGoalActions(rootElement, state, render) {
  rootElement.querySelector('[data-goal-form]')?.addEventListener('submit', async (event) => {
    event.preventDefault();

    const data = Object.fromEntries(new FormData(event.currentTarget));

    try {
      await addGoal({
        ...data,
        targetAmount: parseCurrencyInput(data.targetAmount),
        currentAmount: parseCurrencyInput(data.currentAmount),
      });

      event.currentTarget.reset();
      await refreshAppData(state);
      showToast(state, render, { type: 'success', message: 'Meta criada.' });
    } catch (error) {
      showToast(state, render, { type: 'error', message: error.message || 'Não foi possível criar meta.' });
    }
  });

  rootElement.querySelectorAll('[data-archive-goal]').forEach((button) => {
    button.addEventListener('click', async () => {
      try {
        await archiveGoal(button.dataset.archiveGoal);
        await refreshAppData(state);
        showToast(state, render, { type: 'success', message: 'Meta arquivada.' });
      } catch (error) {
        showToast(state, render, { type: 'error', message: error.message || 'Não foi possível arquivar meta.' });
      }
    });
  });

  rootElement.querySelectorAll('[data-reactivate-goal]').forEach((button) => {
    button.addEventListener('click', async () => {
      try {
        await reactivateGoal(button.dataset.reactivateGoal);
        await refreshAppData(state);
        showToast(state, render, { type: 'success', message: 'Meta reativada.' });
      } catch (error) {
        showToast(state, render, { type: 'error', message: error.message || 'Não foi possível reativar meta.' });
      }
    });
  });

  rootElement.querySelectorAll('[data-edit-goal]').forEach((button) => {
    button.addEventListener('click', async () => {
      const goal = state.data.goals.find((item) => item.id === button.dataset.editGoal);
      if (!goal) return;

      const currentAmount = window.prompt('Valor atual da meta:', goal.currentAmount);
      if (currentAmount === null) return;

      try {
        await updateGoal(goal.id, {
          currentAmount: parseCurrencyInput(currentAmount),
        });
        await refreshAppData(state);
        showToast(state, render, { type: 'success', message: 'Meta atualizada.' });
      } catch (error) {
        showToast(state, render, { type: 'error', message: error.message || 'Não foi possível atualizar meta.' });
      }
    });
  });
}

function bindBudgetActions(rootElement, state, render) {
  rootElement.querySelector('[data-budget-form]')?.addEventListener('submit', async (event) => {
    event.preventDefault();

    const data = Object.fromEntries(new FormData(event.currentTarget));

    try {
      await addBudget({
        ...data,
        amount: parseCurrencyInput(data.amount),
      });

      event.currentTarget.reset();
      await refreshAppData(state);
      showToast(state, render, { type: 'success', message: 'Orçamento salvo.' });
    } catch (error) {
      showToast(state, render, { type: 'error', message: error.message || 'Não foi possível salvar orçamento.' });
    }
  });
}

function bindTransactionActions(rootElement, state, render) {
  rootElement.querySelector('[data-quick-add-form]')?.addEventListener('submit', async (event) => {
    event.preventDefault();

    const data = Object.fromEntries(new FormData(event.currentTarget));
    const category = state.data.categories.find((item) => item.id === data.categoryId);

    try {
      await addTransaction({
        ...data,
        amount: parseCurrencyInput(data.amount),
        description: String(data.description || category?.name || 'Despesa'),
        status: 'confirmed',
        origin: 'quick_add',
      }, {
        accounts: state.data.accounts,
        categories: state.data.categories,
      });

      event.currentTarget.reset();
      await refreshAppData(state);
      showToast(state, render, { type: 'success', message: 'Despesa salva.' });
    } catch (error) {
      showToast(state, render, { type: 'error', message: error.message || 'Não foi possível salvar despesa.' });
    }
  });

  rootElement.querySelector('[data-transaction-form]')?.addEventListener('submit', async (event) => {
    event.preventDefault();

    const data = Object.fromEntries(new FormData(event.currentTarget));

    try {
      await addTransaction({
        ...data,
        amount: parseCurrencyInput(data.amount),
        description: data.description || 'Lançamento',
        status: 'confirmed',
        origin: 'manual',
      }, {
        accounts: state.data.accounts,
        categories: state.data.categories,
      });

      event.currentTarget.reset();
      await refreshAppData(state);
      showToast(state, render, { type: 'success', message: 'Lançamento salvo.' });
    } catch (error) {
      showToast(state, render, { type: 'error', message: error.message || 'Não foi possível salvar lançamento.' });
    }
  });

  rootElement.querySelectorAll('[data-delete-transaction]').forEach((button) => {
    button.addEventListener('click', async () => {
      const confirmed = window.confirm('Excluir este lançamento? Essa ação não pode ser desfeita na interface.');

      if (!confirmed) return;

      try {
        await deleteTransaction(button.dataset.deleteTransaction);
        await refreshAppData(state);
        showToast(state, render, { type: 'success', message: 'Lançamento excluído.' });
      } catch (error) {
        showToast(state, render, { type: 'error', message: error.message || 'Não foi possível excluir.' });
      }
    });
  });

  rootElement.querySelectorAll('[data-edit-transaction]').forEach((button) => {
    button.addEventListener('click', async () => {
      const transaction = state.data.transactions.find((item) => item.id === button.dataset.editTransaction);
      if (!transaction) return;

      const description = window.prompt('Nova descrição:', transaction.description);
      if (!description) return;

      try {
        await updateTransaction(transaction.id, { description }, {
          accounts: state.data.accounts,
          categories: state.data.categories,
        });
        await refreshAppData(state);
        showToast(state, render, { type: 'success', message: 'Lançamento atualizado.' });
      } catch (error) {
        showToast(state, render, { type: 'error', message: error.message || 'Não foi possível atualizar.' });
      }
    });
  });
}

function bindAccountActions(rootElement, state, render) {
  rootElement.querySelector('[data-account-form]')?.addEventListener('submit', async (event) => {
    event.preventDefault();

    const data = Object.fromEntries(new FormData(event.currentTarget));

    try {
      await addAccount(data);
      event.currentTarget.reset();
      await refreshAppData(state);
      showToast(state, render, { type: 'success', message: 'Conta criada.' });
    } catch (error) {
      showToast(state, render, { type: 'error', message: error.message || 'Não foi possível criar conta.' });
    }
  });

  rootElement.querySelectorAll('[data-archive-account]').forEach((button) => {
    button.addEventListener('click', async () => {
      try {
        await archiveAccount(button.dataset.archiveAccount);
        await refreshAppData(state);
        showToast(state, render, { type: 'success', message: 'Conta arquivada.' });
      } catch (error) {
        showToast(state, render, { type: 'error', message: error.message || 'Não foi possível arquivar.' });
      }
    });
  });

  rootElement.querySelectorAll('[data-reactivate-account]').forEach((button) => {
    button.addEventListener('click', async () => {
      try {
        await reactivateAccount(button.dataset.reactivateAccount);
        await refreshAppData(state);
        showToast(state, render, { type: 'success', message: 'Conta reativada.' });
      } catch (error) {
        showToast(state, render, { type: 'error', message: error.message || 'Não foi possível reativar.' });
      }
    });
  });

  rootElement.querySelectorAll('[data-edit-account]').forEach((button) => {
    button.addEventListener('click', async () => {
      const account = state.data.accounts.find((item) => item.id === button.dataset.editAccount);
      if (!account) return;

      const name = window.prompt('Novo nome da conta/cartão:', account.name);
      if (!name) return;

      try {
        await updateAccount(account.id, { name });
        await refreshAppData(state);
        showToast(state, render, { type: 'success', message: 'Conta atualizada.' });
      } catch (error) {
        showToast(state, render, { type: 'error', message: error.message || 'Não foi possível atualizar.' });
      }
    });
  });
}

function bindCategoryActions(rootElement, state, render) {
  rootElement.querySelector('[data-category-form]')?.addEventListener('submit', async (event) => {
    event.preventDefault();

    const data = Object.fromEntries(new FormData(event.currentTarget));

    try {
      await addCategory(data);
      event.currentTarget.reset();
      await refreshAppData(state);
      showToast(state, render, { type: 'success', message: 'Categoria criada.' });
    } catch (error) {
      showToast(state, render, { type: 'error', message: error.message || 'Não foi possível criar categoria.' });
    }
  });

  rootElement.querySelectorAll('[data-archive-category]').forEach((button) => {
    button.addEventListener('click', async () => {
      try {
        await archiveCategory(button.dataset.archiveCategory);
        await refreshAppData(state);
        showToast(state, render, { type: 'success', message: 'Categoria arquivada.' });
      } catch (error) {
        showToast(state, render, { type: 'error', message: error.message || 'Não foi possível arquivar.' });
      }
    });
  });

  rootElement.querySelectorAll('[data-reactivate-category]').forEach((button) => {
    button.addEventListener('click', async () => {
      try {
        await reactivateCategory(button.dataset.reactivateCategory);
        await refreshAppData(state);
        showToast(state, render, { type: 'success', message: 'Categoria reativada.' });
      } catch (error) {
        showToast(state, render, { type: 'error', message: error.message || 'Não foi possível reativar.' });
      }
    });
  });

  rootElement.querySelectorAll('[data-edit-category]').forEach((button) => {
    button.addEventListener('click', async () => {
      const category = state.data.categories.find((item) => item.id === button.dataset.editCategory);
      if (!category) return;

      const name = window.prompt('Novo nome da categoria:', category.name);
      if (!name) return;

      try {
        await updateCategory(category.id, { name });
        await refreshAppData(state);
        showToast(state, render, { type: 'success', message: 'Categoria atualizada.' });
      } catch (error) {
        showToast(state, render, { type: 'error', message: error.message || 'Não foi possível atualizar.' });
      }
    });
  });
}

function bindOnboardingForm(rootElement, state, router, render) {
  const form = rootElement.querySelector('[data-onboarding-form]');

  if (!form || form.dataset.bound === 'true') {
    return;
  }

  form.dataset.bound = 'true';

  form.querySelectorAll('[data-add-custom]').forEach((button) => {
    button.addEventListener('click', () => {
      const targetName = button.dataset.addCustom;
      const inputName = button.dataset.inputName;
      const input = form.elements[inputName];
      const value = String(input?.value ?? '').trim();

      if (!value) {
        showInlineCustomFeedback(form, targetName, 'Digite um nome antes de adicionar.', 'error');
        return;
      }

      const alreadyExists = Array
        .from(form.querySelectorAll(`input[name="${targetName}"]`))
        .some((item) => String(item.value).toLowerCase() === value.toLowerCase());

      if (alreadyExists) {
        showInlineCustomFeedback(form, targetName, 'Esse item já foi adicionado.', 'error');
        return;
      }

      addCustomChoice(form, {
        targetName,
        value,
      });

      input.value = '';
      showInlineCustomFeedback(form, targetName, 'Item adicionado.', 'success');
      input.focus();
    });
  });

  form.addEventListener('click', (event) => {
    const removeButton = event.target.closest('[data-remove-custom]');

    if (!removeButton) return;

    removeButton.closest('.custom-added-chip')?.remove();
  });

  form.addEventListener('submit', async (event) => {
    event.preventDefault();
    event.stopPropagation();

    const submitButton = form.querySelector('[data-onboarding-submit]');
    const formData = new FormData(form);

    const accounts = formData.getAll('accounts').map((name) => ({
      name,
      type: getSuggestedAccountType(name),
      color: getSuggestedAccountColor(name),
    }));

    const categories = [
      ...formData.getAll('expenseCategories').map((name, index) => ({
        name,
        type: 'expense',
        color: getCategoryColor(index),
        sortOrder: index + 1,
      })),
      ...formData.getAll('incomeCategories').map((name, index) => ({
        name,
        type: 'income',
        color: getCategoryColor(index + 20),
        sortOrder: index + 1,
      })),
    ];

    const customAccount = String(formData.get('customAccount') ?? '').trim();
    const customExpenseCategory = String(formData.get('customExpenseCategory') ?? '').trim();
    const customIncomeCategory = String(formData.get('customIncomeCategory') ?? '').trim();

    if (customAccount) {
      accounts.push({
        name: customAccount,
        type: 'checking_account',
        color: '#A3FF12',
      });
    }

    if (customExpenseCategory) {
      categories.push({
        name: customExpenseCategory,
        type: 'expense',
        color: '#A78BFA',
        sortOrder: 500,
      });
    }

    if (customIncomeCategory) {
      categories.push({
        name: customIncomeCategory,
        type: 'income',
        color: '#5BC0FF',
        sortOrder: 500,
      });
    }

    try {
      if (submitButton) {
        submitButton.disabled = true;
        submitButton.textContent = 'Configurando...';
      }

      await completeOnboarding({
        accounts,
        categories,
        theme: 'dark',
      });

      await refreshAppData(state);
      state.onboarding.completed = true;

      showToast(state, render, {
        type: 'success',
        message: 'Configuração concluída.',
      });

      window.location.hash = ROUTES.QUICK_ADD;
      render();
    } catch (error) {
      console.error('Erro no onboarding:', error);

      if (submitButton) {
        submitButton.disabled = false;
        submitButton.textContent = 'Finalizar configuração';
      }

      showToast(state, render, {
        type: 'error',
        message: error.message || 'Não foi possível concluir a configuração.',
      });
    }
  });
}

function addCustomChoice(form, { targetName, value }) {
  const list = form.querySelector(`[data-custom-list="${targetName}"]`);

  if (!list) return;

  const id = `custom-${targetName}-${Date.now()}`;

  list.insertAdjacentHTML('beforeend', `
    <label class="custom-added-chip" for="${id}">
      <input id="${id}" type="checkbox" name="${targetName}" value="${value}" checked />
      <span>${value}</span>
      <small>adicionado</small>
      <button type="button" aria-label="Remover ${value}" data-remove-custom>×</button>
    </label>
  `);
}

function showInlineCustomFeedback(form, targetName, message, type = 'success') {
  const list = form.querySelector(`[data-custom-list="${targetName}"]`);

  if (!list) return;

  let feedback = list.querySelector('[data-custom-feedback]');

  if (!feedback) {
    feedback = document.createElement('p');
    feedback.dataset.customFeedback = 'true';
    list.prepend(feedback);
  }

  feedback.className = `custom-added-feedback custom-added-feedback--${type}`;
  feedback.textContent = message;

  window.setTimeout(() => {
    feedback?.remove();
  }, 1600);
}

function getSuggestedAccountType(name) {
  const lowerName = String(name).toLowerCase();

  if (lowerName.includes('dinheiro')) return 'cash';
  if (lowerName.includes('vr')) return 'benefit';
  if (lowerName.includes('nubank')) return 'credit_card';

  return 'checking_account';
}

function getSuggestedAccountColor(name) {
  const lowerName = String(name).toLowerCase();

  if (lowerName.includes('nubank')) return '#8B5CF6';
  if (lowerName.includes('itaú')) return '#FF7A00';
  if (lowerName.includes('inter')) return '#FF8A00';
  if (lowerName.includes('vr')) return '#5BC0FF';

  return '#A3FF12';
}

function getCategoryColor(index) {
  const colors = ['#FFB86B', '#A3FF12', '#5BC0FF', '#C8CED6', '#FF5C5C', '#A78BFA', '#FFD166', '#6F7D86'];

  return colors[index % colors.length];
}

function showToast(state, render, toast) {
  clearToastTimer(state);
  setToast(state, toast);
  render();

  if (!toast || toast.type === 'error') {
    return;
  }

  state.ui.toastTimer = window.setTimeout(() => {
    setToast(state, null);
    state.ui.toastTimer = null;
    render();
  }, 2000);
}
