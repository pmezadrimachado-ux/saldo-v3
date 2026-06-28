import { formatCurrency } from '../../../utils/currency.js';

export function renderWeekBarChart({
  values = [],
  labels = ['D', 'S', 'T', 'Q', 'Q', 'S', 'S'],
} = {}) {
  const safeValues = values.map((value) => Number(value || 0));
  const maxValue = Math.max(...safeValues, 1);
  const total = safeValues.reduce((sum, value) => sum + value, 0);

  return `
    <div class="chart-with-values">
      <div class="chart-with-values__plot chart-with-values__plot--week">
        ${safeValues.map((value, index) => {
          const height = value > 0 ? Math.max(8, Math.round((value / maxValue) * 100)) : 4;

          return `
            <div class="chart-with-values__item">
              <strong class="chart-with-values__value">${formatCurrency(value)}</strong>
              <span class="chart-with-values__bar" style="height:${height}%"></span>
              <small>${labels[index] ?? ''}</small>
            </div>
          `;
        }).join('')}
      </div>

      <p class="chart-with-values__total">
        Total da semana: <strong>${formatCurrency(total)}</strong>
      </p>
    </div>
  `;
}
