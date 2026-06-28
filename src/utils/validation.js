export function isNonEmptyString(value) {
  return typeof value === 'string' && value.trim().length > 0;
}

export function isPositiveNumber(value) {
  return Number.isFinite(Number(value)) && Number(value) > 0;
}
