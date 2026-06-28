import { formatCurrency } from '../../../utils/currency.js';

export function renderBudgetStatusList(items = []) {
  if (!items.length) {
    return `<p class="card__description">Nenhum orçamento configurado para este mês.</p>`;
  }

  return `
    <div class="budget-list">
      ${items.map(renderBudgetStatusCard).join('')}
    </div>
  `;
}

export function renderBudgetStatusCard(item) {
  const label = item.budget.type === 'monthly_total' ? 'Orçamento mensal' : 'Limite de categoria';

  return `
    <article class="budget-card budget-card--${item.status}">
      <div class="budget-card__header">
        <div>
          <p>${label}</p>
          <strong>${formatCurrency(item.budget.amount)}</strong>
        </div>
        <span>${item.percentage}%</span>
      </div>

      <div class="budget-card__bar">
        <span style="width:${Math.min(item.percentage, 100)}%"></span>
      </div>

      <p class="budget-card__meta">
        Usado: ${formatCurrency(item.used)} •
        ${item.remaining >= 0 ? 'Restante' : 'Excedido'}: ${formatCurrency(Math.abs(item.remaining))}
      </p>
    </article>
  `;
}
