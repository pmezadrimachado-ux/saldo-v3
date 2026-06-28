import { isNonEmptyString, isPositiveNumber } from '../../utils/validation.js';

const VALID_GOAL_STATUS = ['active', 'completed', 'archived'];

export function validateGoal(goal) {
  const errors = [];

  if (!isNonEmptyString(goal.name)) {
    errors.push('Informe o nome da meta.');
  }

  if (!isPositiveNumber(goal.targetAmount)) {
    errors.push('Informe um valor alvo maior que zero.');
  }

  if (Number(goal.currentAmount) < 0) {
    errors.push('O valor atual não pode ser negativo.');
  }

  if (!VALID_GOAL_STATUS.includes(goal.status)) {
    errors.push('Status de meta inválido.');
  }

  return errors;
}
