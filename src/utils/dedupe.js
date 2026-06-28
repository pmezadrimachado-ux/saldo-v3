export function normalizeDedupeKey(value) {
  return String(value ?? '')
    .trim()
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '');
}

export function uniqueBy(items = [], getKey) {
  const seen = new Set();

  return items.filter((item) => {
    const key = normalizeDedupeKey(getKey(item));

    if (!key || seen.has(key)) {
      return false;
    }

    seen.add(key);
    return true;
  });
}

export function uniqueAccounts(accounts = []) {
  return uniqueBy(accounts, (account) => `${account.type}:${account.name}`);
}

export function uniqueCategories(categories = []) {
  return uniqueBy(categories, (category) => `${category.type}:${category.name}`);
}
