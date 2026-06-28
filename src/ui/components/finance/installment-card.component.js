import { formatCurrency } from '../../../utils/currency.js';
import { formatDateBR } from '../../../utils/date.js';

export function renderInstallmentList(groups = []) {
  if (!groups.length) {
    return `<p class="card__description">Nenhum parcelamento cadastrado.</p>`;
  }

  return `
    <div class="installment-list">
      ${groups.map(renderInstallmentCard).join('')}
    </div>
  `;
}

export function renderInstallmentCard(group) {
  return `
    <article class="installment-card">
      <div>
        <p>Parcelamento</p>
        <strong>${group.description}</strong>
        <span>${group.installmentCount}x de ${formatCurrency(group.installmentAmount)} • início ${formatDateBR(group.startDate)}</span>
      </div>
      <div class="installment-card__side">
        <strong>${formatCurrency(group.totalAmount)}</strong>
        <span>${group.status === 'active' ? 'Ativo' : 'Cancelado'}</span>
      </div>
    </article>
  `;
}
