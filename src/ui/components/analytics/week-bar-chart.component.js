import { formatCurrency } from '../../../utils/currency.js';

export function renderWeekBarChart({
  values = [],
  labels = ['D', 'S', 'T', 'Q', 'Q', 'S', 'S'],
} = {}) {
  const maxValue = Math.max(...values.map((value) => Number(value)), 1);
  const total = values.reduce((sum, value) => sum + Number(value || 0), 0);

  return `
    <div class="week-chart week-chart--with-values">
      <div class="week-chart__plot">
        ${values.map((value, index) => {
          const numericValue = Number(value || 0);
          const height = numericValue > 0 ? Math.max(8, Math.round((numericValue / maxValue) * 100)) : 4;

          return `
            <div class="week-chart__item">
              <strong class="week-chart__value">${numericValue > 0 ? formatCurrency(numericValue) : 'R$ 0,00'}</strong>
              <div class="week-chart__bar" style="height:${height}%"></div>
              <span>${labels[index] ?? ''}</span>
            </div>
          `;
        }).join('')}
      </div>
      <p class="week-chart__total">
        Total da semana: <strong>${formatCurrency(total)}</strong>
      </p>
    </div>
  `;
}
