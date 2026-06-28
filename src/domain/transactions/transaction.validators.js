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

  const category = categories.find((item) => item.id === transaction.categoryId);

  if (transaction.type !== 'transfer' && categories.length && !category) {
    errors.push('Categoria não encontrada.');
  }

  if (
    transaction.type !== 'transfer'
    && category
    && category.type !== transaction.type
  ) {
    errors.push('A categoria selecionada não combina com o tipo do lançamento.');
  }

  return errors;
}
