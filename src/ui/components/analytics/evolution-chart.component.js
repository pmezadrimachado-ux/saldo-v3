import { formatCurrency } from '../../../utils/currency.js';

export function renderEvolutionChart(items = []) {
  if (!items.length) {
    return `<p class="card__description">Sem dados suficientes para evolução.</p>`;
  }

  const maxValue = Math.max(...items.map((item) => Math.max(Number(item.income || 0), Number(item.expenses || 0))), 1);
  const totalExpenses = items.reduce((sum, item) => sum + Number(item.expenses || 0), 0);

  return `
    <div class="evolution-chart evolution-chart--with-values">
      <div class="evolution-chart__plot">
        ${items.map((item) => {
          const incomeHeight = Number(item.income || 0) > 0 ? Math.max(6, Math.round((Number(item.income || 0) / maxValue) * 100)) : 4;
          const expenseHeight = Number(item.expenses || 0) > 0 ? Math.max(6, Math.round((Number(item.expenses || 0) / maxValue) * 100)) : 4;

          return `
            <div class="evolution-chart__item">
              <strong class="evolution-chart__value">${formatCurrency(item.expenses || 0)}</strong>
              <div class="evolution-chart__bars">
                <span class="evolution-chart__bar evolution-chart__bar--income" style="height:${incomeHeight}%"></span>
                <span class="evolution-chart__bar evolution-chart__bar--expense" style="height:${expenseHeight}%"></span>
              </div>
              <small>${String(item.monthKey ?? '').slice(5) || '-'}</small>
            </div>
          `;
        }).join('')}
      </div>
      <p class="evolution-chart__total">
        Total de despesas no período: <strong>${formatCurrency(totalExpenses)}</strong>
      </p>
    </div>
  `;
}
