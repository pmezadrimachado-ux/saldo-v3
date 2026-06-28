import { isNonEmptyString } from '../../utils/validation.js';

const VALID_CATEGORY_TYPES = ['expense', 'income', 'transfer'];

export function validateCategory(category) {
  const errors = [];

  if (!isNonEmptyString(category.name)) {
    errors.push('Informe o nome da categoria.');
  }

  if (!VALID_CATEGORY_TYPES.includes(category.type)) {
    errors.push('Tipo de categoria inválido.');
  }

  return errors;
}
