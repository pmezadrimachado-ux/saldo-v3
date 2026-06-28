import { formatCurrency } from '../../../utils/currency.js';

export function renderHorizontalBarChart({
  items = [],
  labelKey = 'label',
  valueKey = 'value',
  colorKey = 'color',
  emptyMessage = 'Sem dados para exibir.',
} = {}) {
  if (!items.length) {
    return `<p class="card__description">${emptyMessage}</p>`;
  }

  const max = Math.max(...items.map((item) => Number(item[valueKey]) || 0), 1);

  return `
    <div class="horizontal-chart">
      ${items.map((item) => {
        const value = Number(item[valueKey]) || 0;
        const width = Math.max(4, Math.round((value / max) * 100));

        return `
          <div class="horizontal-chart__item">
            <div class="horizontal-chart__row">
              <span>${item[labelKey]}</span>
              <strong>${formatCurrency(value)}</strong>
            </div>
            <div class="horizontal-chart__track">
              <span style="width:${width}%; background:${item[colorKey] || '#A3FF12'}"></span>
            </div>
          </div>
        `;
      }).join('')}
    </div>
  `;
}
