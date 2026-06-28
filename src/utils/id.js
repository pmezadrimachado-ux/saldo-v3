export function createId(prefix = 'id') {
  const cryptoId = crypto?.randomUUID?.();

  if (cryptoId) {
    return `${prefix}_${cryptoId}`;
  }

  return `${prefix}_${Date.now()}_${Math.random().toString(16).slice(2)}`;
}
