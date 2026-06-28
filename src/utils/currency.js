export function parseCurrencyInput(value) {
  if (typeof value === 'number') return value;

  const normalized = String(value ?? '')
    .replace(/[^0-9,.-]/g, '')
    .replace(/\./g, '')
    .replace(',', '.');

  const parsed = Number(normalized);

  return Number.isFinite(parsed) ? parsed : 0;
}

export function formatCurrency(value, locale = 'pt-BR', currency = 'BRL') {
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency,
  }).format(Number(value) || 0);
}

export function roundMoney(value) {
  return Math.round((Number(value) || 0) * 100) / 100;
}
