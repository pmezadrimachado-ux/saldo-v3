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
  const color = account.color || '#A3FF12';

  return `
    <button
      class="account-choice-grid__item${selectedClass}"
      type="button"
      data-account-choice="${account.id}"
      aria-pressed="${pressed}"
    >
      <span class="account-choice-grid__icon" style="--account-color:${color}">
        ${getAccountLabel(account.name)}
      </span>
      <strong>${account.name}</strong>
    </button>
  `;
}

function getAccountLabel(name = '') {
  const cleanName = String(name).trim();

  if (!cleanName) return 'R$';

  const knownLabels = {
    nubank: 'NU',
    itau: 'I',
    itaú: 'I',
    inter: 'IN',
    dinheiro: 'R$',
    vr: 'VR',
    bradesco: 'B',
    santander: 'S',
    caixa: 'CX',
  };

  const key = cleanName.toLowerCase();

  if (knownLabels[key]) {
    return knownLabels[key];
  }

  return cleanName
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part.charAt(0).toUpperCase())
    .join('');
}
