import { formatCurrency } from '../../../utils/currency.js';

export function renderCategoryRanking(items = []) {
  if (!items.length) return `<p class="card__description">Nenhuma despesa por categoria neste mês.</p>`;
  const max = Math.max(...items.map((item) => Number(item.total)), 1);
  return `
    <div class="category-ranking">
      ${items.slice(0, 5).map((item) => {
        const width = Math.max(6, Math.round((item.total / max) * 100));
        return `
          <div class="category-ranking__item">
            <div class="category-ranking__row">
              <span><i style="background:${item.category.color || '#A3FF12'}"></i>${item.category.name}</span>
              <strong>${formatCurrency(item.total)}</strong>
            </div>
            <div class="category-ranking__bar"><span style="width:${width}%; background:${item.category.color || '#A3FF12'}"></span></div>
          </div>
        `;
      }).join('')}
    </div>
  `;
}
