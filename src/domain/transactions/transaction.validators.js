import { isNonEmptyString, isPositiveNumber } from '../../utils/validation.js';

const VALID_TRANSACTION_TYPES = ['expense', 'income', 'transfer'];
const VALID_TRANSACTION_STATUS = ['confirmed', 'pending', 'canceled'];

export function validateTransaction(transaction, { accounts = [], categories = [] } = {}) {
  const errors = [];

  if (!VALID_TRANSACTION_TYPES.includes(transaction.type)) {
    errors.push('Tipo de lançamento inválido.');
  }

  if (!VALID_TRANSACTION_STATUS.includes(transaction.status)) {
    errors.push('Status inválido.');
  }

  if (!isPositiveNumber(transaction.amount)) {
    errors.push('Informe um valor maior que zero.');
  }

  if (!isNonEmptyString(transaction.date)) {
    errors.push('Informe a data.');
  }

  if (!isNonEmptyString(transaction.accountId)) {
    errors.push('Selecione uma conta ou cartão.');
  }

  if (transaction.type !== 'transfer' && !isNonEmptyString(transaction.categoryId)) {
    errors.push('Selecione uma categoria.');
  }

  if (accounts.length && !accounts.some((account) => account.id === transaction.accountId)) {
    errors.push('Conta ou cartão não encontrado.');
  }

  if (
    transaction.type !== 'transfer'
    && categories.length
    && !categories.some((category) => category.id === transaction.categoryId)
  ) {
    errors.push('Categoria não encontrada.');
  }

  return errors;
}
