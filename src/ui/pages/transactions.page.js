import { renderCard } from '../components/base/card.component.js';
import { renderCurrencyInput } from '../components/forms/currency-input.component.js';
import { renderTextInput } from '../components/forms/text-input.component.js';
import { renderTransactionList } from '../components/finance/transaction-list.component.js';
import { getTodayInputValue } from '../../utils/date.js';

export function renderTransactionsPage({ state }) {
  const accounts = state.data.accounts.filter((account) => account.isActive);
  const categories = state.data.categories.filter((category) => category.isActive);

  return `
    <section class="page page--placeholder">
      <p class="page__eyebrow">Histórico</p>
      <h2>Transações</h2>
      <p>Registre receitas, despesas e consulte seu histórico.</p>

      ${renderCard({
        eyebrow: 'Lançamento completo',
        title: 'Novo lançamento',
        content: `
          <form class="transaction-form" data-transaction-form>
            <label class="field">
              <span class="field__label">Tipo</span>
              <select class="input" name="type" required>
                <option value="expense">Despesa</option>
                <option value="income">Receita</option>
              </select>
            </label>

            ${renderCurrencyInput({
              label: 'Valor',
              required: true,
            })}

            <label class="field">
              <span class="field__label">Conta ou cartão</span>
              <select class="input" name="accountId" required>
                ${accounts.map((account) => `<option value="${account.id}">${account.name}</option>`).join('')}
              </select>
            </label>

            <label class="field">
              <span class="field__label">Categoria</span>
              <select class="input" name="categoryId" required>
                ${categories.map((category) => `<option value="${category.id}">${category.name} (${category.type === 'income' ? 'Receita' : 'Despesa'})</option>`).join('')}
              </select>
            </label>

            <label class="field">
              <span class="field__label">Data</span>
              <input class="input" type="date" name="date" value="${getTodayInputValue()}" required />
            </label>

            ${renderTextInput({
              name: 'description',
              label: 'Descrição',
              placeholder: 'Ex.: Salário, mercado, transporte',
            })}

            <button class="button button--primary" type="submit">Salvar lançamento</button>
          </form>
        `,
      })}

      ${renderCard({
        eyebrow: 'Histórico',
        title: `${state.data.transactions.filter((item) => item.deletedAt === null).length} lançamento(s)`,
        content: renderTransactionList({
          transactions: state.data.transactions,
          accounts: state.data.accounts,
          categories: state.data.categories,
        }),
      })}
    </section>
  `;
}
