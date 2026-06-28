import { renderCard } from '../components/base/card.component.js';
import { renderBudgetStatusList } from '../components/finance/budget-card.component.js';
import { getAnalyticsData } from '../../services/analytics.service.js';

export function renderBudgetsPage({ state }) {
  const analytics = getAnalyticsData(state);
  const expenseCategories = state.data.categories.filter((category) => category.isActive && category.type === 'expense');

  return `
    <section class="page page--placeholder">
      <p class="page__eyebrow">Planejamento</p>
      <h2>Orçamentos</h2>
      <p>Defina limites mensais e acompanhe quanto já foi utilizado.</p>

      ${renderCard({
        eyebrow: 'Novo orçamento',
        title: 'Adicionar limite',
        content: `
          <form class="entity-form" data-budget-form>
            <label class="field">
              <span class="field__label">Tipo</span>
              <select class="input" name="type" required>
                <option value="monthly_total">Orçamento mensal</option>
                <option value="category_limit">Limite por categoria</option>
              </select>
            </label>

            <label class="field">
              <span class="field__label">Mês</span>
              <input class="input" type="month" name="monthKey" value="${state.session.selectedMonth}" required />
            </label>

            <label class="field">
              <span class="field__label">Categoria</span>
              <select class="input" name="categoryId">
                <option value="">Não aplicar</option>
                ${expenseCategories.map((category) => `<option value="${category.id}">${category.name}</option>`).join('')}
              </select>
            </label>

            <label class="field">
              <span class="field__label">Valor</span>
              <input class="input" name="amount" inputmode="decimal" placeholder="Ex.: 1500" required />
            </label>

            <button class="button button--primary" type="submit">Salvar orçamento</button>
          </form>
        `,
      })}

      ${renderCard({
        eyebrow: 'Status',
        title: 'Orçamentos do mês',
        content: renderBudgetStatusList(analytics.budgetsStatus),
      })}
    </section>
  `;
}
