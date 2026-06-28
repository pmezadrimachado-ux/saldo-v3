import { formatCurrency } from '../../../utils/currency.js';

export function renderCardBillList(bills = []) {
  if (!bills.length) {
    return `<p class="card__description">Nenhum cartão de crédito cadastrado.</p>`;
  }

  return `
    <div class="card-bill-list">
      ${bills.map(renderCardBill).join('')}
    </div>
  `;
}

export function renderCardBill(bill) {
  return `
    <article class="card-bill card-bill--${bill.status}">
      <div class="card-bill__header">
        <div>
          <p>Fatura</p>
          <strong>${bill.card.name}</strong>
        </div>
        <span>${formatCurrency(bill.total)}</span>
      </div>

      <div class="card-bill__bar">
        <span style="width:${Math.min(bill.usedPercentage, 100)}%"></span>
      </div>

      <p class="card-bill__meta">
        ${bill.transactionCount} lançamento(s)
        ${bill.limit ? `• limite ${formatCurrency(bill.limit)}` : ''}
        ${bill.available !== null ? `• disponível ${formatCurrency(bill.available)}` : ''}
      </p>

      <p class="card-bill__meta">
        ${bill.closingDay ? `Fecha dia ${bill.closingDay}` : 'Fechamento não definido'}
        ${bill.dueDay ? `• vence dia ${bill.dueDay}` : ''}
      </p>
    </article>
  `;
}
