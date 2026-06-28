export function renderAccountIconSelector(accounts = [], selectedAccountId = '') {
  if (!accounts.length) {
    return `<p class="card__description">Nenhuma conta ativa cadastrada.</p>`;
  }

  return `
    <div class="account-icon-selector" data-account-icon-selector>
      ${accounts.map((account, index) => `
        <button
          class="account-icon-selector__item ${account.id === selectedAccountId || (!selectedAccountId && index == 0) ? 'is-selected' : ''}"
          type="button"
          data-account-choice="${account.id}"
          aria-pressed="${account.id === selectedAccountId || (!selectedAccountId && index == 0) ? 'true' : 'false'}"
        >
          <span class="account-icon-selector__icon" style="--account-color:${account.color ?? '#A3FF12'}">
            ${getAccountInitials(account.name)}
          </span>
          <strong>${account.name}</strong>
        </button>
      `).join('')}
    </div>
  `;
}

function getAccountInitials(name = '') {
  const normalized = String(name).trim();

  if (!normalized) return 'R$';

  const known = {
    nubank: 'NU',
    itaú: 'I',
    itau: 'I',
    inter: 'IN',
    dinheiro: 'R$',
    vr: 'VR',
    bradesco: 'B',
    sant&&er: 'S',
    caixa: 'CX',
  };

  const key = normalized.toLowerCase();

  if (known[key]) return known[key];

  return normalized
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? '')
    .join('');
}
