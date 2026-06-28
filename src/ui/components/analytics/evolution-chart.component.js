import { formatCurrency } from '../../../utils/currency.js';

export function renderEvolutionChart(items = []) {
  if (!items.length) {
    return `<p class="card__description">Sem dados suficientes para evolução.</p>`;
  }

  const maxValue = Math.max(
    ...items.map((item) => Math.max(Number(item.income || 0), Number(item.expenses || 0))),
    1,
  );

  const totalExpenses = items.reduce((sum, item) => sum + Number(item.expenses || 0), 0);

  return `
    <div class="chart-with-values">
      <div class="chart-with-values__plot chart-with-values__plot--months">
        ${items.map((item) => {
          const income = Number(item.income || 0);
          const expenses = Number(item.expenses || 0);
          const incomeHeight = income > 0 ? Math.max(6, Math.round((income / maxValue) * 100)) : 4;
          const expenseHeight = expenses > 0 ? Math.max(6, Math.round((expenses / maxValue) * 100)) : 4;

          return `
            <div class="chart-with-values__item">
              <strong class="chart-with-values__value">${formatCurrency(expenses)}</strong>
              <div class="chart-with-values__dual-bars">
                <span class="chart-with-values__bar chart-with-values__bar--income" style="height:${incomeHeight}%"></span>
                <span class="chart-with-values__bar chart-with-values__bar--expense" style="height:${expenseHeight}%"></span>
              </div>
              <small>${String(item.monthKey ?? '').slice(5) || '-'}</small>
            </div>
          `;
        }).join('')}
      </div>

      <p class="chart-with-values__total">
        Total de despesas no período: <strong>${formatCurrency(totalExpenses)}</strong>
      </p>
    </div>
  `;
}
