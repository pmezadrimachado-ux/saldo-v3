export function normalizeBankName(value) {
  return String(value ?? '')
    .trim()
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

export function createBankLookupKeys(value) {
  const normalized = normalizeBankName(value);

  if (!normalized) return [];

  const withoutBankPrefix = normalized.replace(/^banco\s+/, '').trim();

  return Array.from(new Set([
    normalized,
    withoutBankPrefix,
  ].filter(Boolean)));
}
