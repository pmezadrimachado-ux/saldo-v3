import { isNonEmptyString, isPositiveNumber } from '../../utils/validation.js';

const VALID_BUDGET_TYPES = ['monthly_total', 'category_limit', 'account_limit'];

export function validateBudget(budget) {
  const errors = [];

  if (!VALID_BUDGET_TYPES.includes(budget.type)) {
    errors.push('Tipo de orçamento inválido.');
  }

  if (!isNonEmptyString(budget.monthKey)) {
    errors.push('Informe o mês do orçamento.');
  }

  if (!isPositiveNumber(budget.amount)) {
    errors.push('Informe um valor maior que zero para o orçamento.');
  }

  if (budget.type === 'category_limit' && !isNonEmptyString(budget.categoryId)) {
    errors.push('Selecione uma categoria para o limite.');
  }

  return errors;
}
