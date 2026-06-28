import { formatCurrency } from '../../../utils/currency.js';

export function renderProjectionChart(projection = []) {
  if (!projection.length) {
    return `<p class="card__description">Sem dados para projeção.</p>`;
  }

  const max = Math.max(...projection.map((item) => Math.max(item.expenses, item.income)), 1);

  return `
    <div class="projection-chart">
      ${projection.map((item) => {
        const expenseHeight = Math.max(6, Math.round((item.expenses / max) * 100));
        const incomeHeight = Math.max(6, Math.round((item.income / max) * 100));
        const installmentHeight = Math.max(4, Math.round((item.installmentExpenses / max) * 100));

        return `
          <div class="projection-chart__item">
            <div class="projection-chart__bars" title="${item.monthKey}">
              <span class="projection-chart__bar projection-chart__bar--income" style="height:${incomeHeight}%"></span>
              <span class="projection-chart__bar projection-chart__bar--expense" style="height:${expenseHeight}%"></span>
              <span class="projection-chart__bar projection-chart__bar--installment" style="height:${installmentHeight}%"></span>
            </div>
            <strong>${formatCurrency(item.expenses)}</strong>
            <small>${item.monthKey.slice(5)}</small>
          </div>
        `;
      }).join('')}
    </div>
  `;
}

export function renderProjectionSummary(summary) {
  if (!summary) return '';

  return `
    <div class="projection-summary">
      <article>
        <p>Despesas futuras</p>
        <strong>${formatCurrency(summary.totalFutureExpenses)}</strong>
      </article>
      <article>
        <p>Parcelas futuras</p>
        <strong>${formatCurrency(summary.totalInstallments)}</strong>
      </article>
      <article>
        <p>Mês mais pesado</p>
        <strong>${summary.worstMonth ? summary.worstMonth.monthKey : '-'}</strong>
      </article>
    </div>
  `;
}
