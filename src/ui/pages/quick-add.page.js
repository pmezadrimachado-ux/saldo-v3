import { renderButton } from '../components/base/button.component.js';
import { renderCurrencyInput } from '../components/forms/currency-input.component.js';
import { uniqueAccounts, uniqueCategories } from '../../utils/dedupe.js';
import { renderChipSelector } from '../components/forms/chip-selector.component.js';
import { renderTextInput } from '../components/forms/text-input.component.js';
import { getTodayInputValue } from '../../utils/date.js';

export function renderQuickAddPage({ state }) {
  const accounts = uniqueAccounts(state.data.accounts).filter((account) => account.isActive);
  const categories = state.data.categories.filter((category) => category.isActive && category.type === 'expense');

  const selectedAccountId =
    state.data.preferences?.quickAddLastAccountId
    || state.data.settings?.defaultAccountId
    || accounts[0]?.id
    || '';

  const selectedCategoryId =
    state.data.preferences?.quickAddLastCategoryId
    || state.data.settings?.defaultCategoryId
    || categories[0]?.id
    || '';

  return `
    <section class="page quick-add-placeholder">
      <p class="page__eyebrow">Lançamento rápido</p>
      <h2>Quanto você gastou?</h2>

      <form class="quick-add-form" data-quick-add-form>
        <input type="hidden" name="type" value="expense" />
        <input type="hidden" name="date" value="${getTodayInputValue()}" />

        ${renderCurrencyInput({
          label: 'Valor da despesa',
          autofocus: true,
        })}

        ${renderChipSelector({
          name: 'categoryId',
          label: 'Categoria',
          items: categories.map((category) => ({
            id: category.id,
            name: category.name,
            icon: '',
          })),
          selectedId: selectedCategoryId,
        })}

        ${renderChipSelector({
          name: 'accountId',
          label: 'Conta ou cartão',
          items: accounts.map((account) => ({
            id: account.id,
            name: account.name,
            icon: '',
          })),
          selectedId: selectedAccountId,
        })}

        ${renderTextInput({
          name: 'description',
          label: 'Descrição opcional',
          placeholder: 'Ex.: Café, almoço, mercado',
        })}

        <div class="placeholder-actions">
          ${renderButton({
            label: 'Salvar despesa',
            variant: 'primary',
            size: 'lg',
            type: 'submit',
          })}
          ${renderButton({
            label: 'Lançamento completo',
            variant: 'secondary',
            route: '#/transactions',
          })}
        </div>
      </form>
    </section>
  `;
}
