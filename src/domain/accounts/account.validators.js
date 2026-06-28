import { isNonEmptyString } from '../../utils/validation.js';

const VALID_ACCOUNT_TYPES = [
  'cash',
  'checking_account',
  'credit_card',
  'debit_card',
  'benefit',
  'wallet',
  'other',
];

export function validateAccount(account) {
  const errors = [];

  if (!isNonEmptyString(account.name)) {
    errors.push('Informe o nome da conta ou cartão.');
  }

  if (!VALID_ACCOUNT_TYPES.includes(account.type)) {
    errors.push('Tipo de conta inválido.');
  }

  return errors;
}
