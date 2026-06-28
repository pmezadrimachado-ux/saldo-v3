import { findBankLogoByName } from '../../../config/bank-logo.registry.js';

export function renderBankLogo(account, {
  className = 'bank-logo',
  showFallback = true,
} = {}) {
  const bank = findBankLogoByName(account?.name);
  const label = account?.name ?? bank?.name ?? 'Conta';
  const color = bank?.color ?? account?.color ?? '#A3FF12';

  if (bank?.assetPath) {
    return `
      <span class="${className}" style="--bank-logo-color:${color}" title="${label}">
        <img src="${bank.assetPath}" alt="${label}" loading="lazy" />
      </span>
    `;
  }

  if (!showFallback) {
    return '';
  }

  return `
    <span class="${className} ${className}--fallback" style="--bank-logo-color:${color}" title="${label}">
      ${getFallbackLabel(label)}
    </span>
  `;
}

export function getFallbackLabel(name = '') {
  const cleanName = String(name).trim();

  if (!cleanName) return 'R$';

  if (cleanName.toLowerCase().includes('dinheiro')) {
    return 'R$';
  }

  return cleanName
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part.charAt(0).toUpperCase())
    .join('');
}
