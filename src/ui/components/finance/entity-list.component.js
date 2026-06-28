import { renderBadge } from '../base/badge.component.js';

export function renderEntityList({
  items = [],
  type = 'account',
  emptyMessage = 'Nenhum item cadastrado.',
} = {}) {
  if (!items.length) {
    return `<p class="card__description">${emptyMessage}</p>`;
  }

  return `
    <div class="entity-list">
      ${items.map((item) => renderEntityItem(item, type)).join('')}
    </div>
  `;
}

function renderEntityItem(item, type) {
  const label = item.isActive ? 'Ativo' : 'Arquivado';
  const tone = item.isActive ? 'success' : 'neutral';
  const archiveAction = item.isActive ? 'archive' : 'reactivate';
  const archiveLabel = item.isActive ? 'Arquivar' : 'Reativar';

  return `
    <article class="entity-item">
      <span class="entity-item__dot" style="background:${item.color || '#A3FF12'}"></span>

      <div class="entity-item__content">
        <strong>${item.name}</strong>
        <p>${formatEntityType(item.type)} ${renderBadge({ label, tone })}</p>
      </div>

      <div class="entity-item__actions">
        <button class="entity-action" type="button" data-edit-${type}="${item.id}">Editar</button>
        <button class="entity-action" type="button" data-${archiveAction}-${type}="${item.id}">${archiveLabel}</button>
      </div>
    </article>
  `;
}

function formatEntityType(type) {
  const labels = {
    cash: 'Dinheiro',
    checking_account: 'Conta',
    credit_card: 'Cartão de crédito',
    debit_card: 'Cartão de débito',
    benefit: 'Benefício',
    wallet: 'Carteira',
    other: 'Outro',
    expense: 'Despesa',
    income: 'Receita',
    transfer: 'Transferência',
  };

  return labels[type] ?? type;
}
