import { formatCurrency } from '../../../utils/currency.js';

export function renderEvolutionChart(items = []) {
  if (!items.length) {
    return `<p class="card__description">Ainda não há histórico mensal suficiente.</p>`;
  }

  const max = Math.max(...items.flatMap((item) => [item.income, item.expense]).map(Number), 1);

  return `
    <div class="evolution-chart-v3">
      ${items.map((item) => {
        const incomeHeight = Math.max(6, Math.round((Number(item.income) / max) * 100));
        const expenseHeight = Math.max(6, Math.round((Number(item.expense) / max) * 100));

        return `
          <div class="evolution-chart-v3__item">
            <div class="evolution-chart-v3__bars" title="Receitas ${formatCurrency(item.income)} • Despesas ${formatCurrency(item.expense)}">
              <span class="evolution-chart-v3__bar evolution-chart-v3__bar--income" style="height:${incomeHeight}%"></span>
              <span class="evolution-chart-v3__bar evolution-chart-v3__bar--expense" style="height:${expenseHeight}%"></span>
            </div>
            <small>${item.monthKey.slice(5)}</small>
          </div>
        `;
      }).join('')}
    </div>
  `;
}
