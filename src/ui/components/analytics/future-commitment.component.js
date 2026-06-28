import { formatCurrency } from '../../../utils/currency.js';

export function renderFutureCommitment(items = []) {
  if (!items.length) {
    return `<p class="card__description">Nenhum parcelamento futuro registrado.</p>`;
  }

  const max = Math.max(...items.map((item) => Number(item.total)), 1);

  return `
    <div class="future-commitment">
      ${items.map((item) => {
        const height = Math.max(8, Math.round((item.total / max) * 100));

        return `
          <div class="future-commitment__item">
            <div class="future-commitment__bar" style="height:${height}%"></div>
            <strong>${formatCurrency(item.total)}</strong>
            <small>${item.monthKey.slice(5)}</small>
          </div>
        `;
      }).join('')}
    </div>
  `;
}
