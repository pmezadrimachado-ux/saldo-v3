import { renderBankLogo } from './bank-logo.component.js';

export function renderAccountChoiceGrid(accounts = []) {
  if (!accounts.length) {
    return `<p class="card__description">Nenhuma conta ou cartão ativo cadastrado.</p>`;
  }

  return `
    <div class="account-choice-grid" data-account-choice-grid>
      ${accounts.map((account, index) => renderAccountChoice(account, index === 0)).join('')}
    </div>
  `;
}

function renderAccountChoice(account, selected) {
  const selectedClass = selected ? ' is-selected' : '';
  const pressed = selected ? 'true' : 'false';

  return `
    <button
      class="account-choice-grid__item${selectedClass}"
      type="button"
      data-account-choice="${account.id}"
      aria-pressed="${pressed}"
    >
      ${renderBankLogo(account, { className: 'account-choice-grid__logo' })}
      <strong>${account.name}</strong>
    </button>
  `;
}
