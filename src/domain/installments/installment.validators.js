import { isNonEmptyString, isPositiveNumber } from '../../utils/validation.js';

export function validateInstallmentGroup(group) {
  const errors = [];

  if (!isNonEmptyString(group.description)) errors.push('Informe a descrição da compra.');
  if (!isPositiveNumber(group.totalAmount)) errors.push('Informe o valor total da compra.');
  if (!Number.isInteger(Number(group.installmentCount)) || Number(group.installmentCount) < 2) errors.push('Informe pelo menos 2 parcelas.');
  if (!isNonEmptyString(group.accountId)) errors.push('Selecione uma conta ou cartão.');
  if (!isNonEmptyString(group.categoryId)) errors.push('Selecione uma categoria.');
  if (!isNonEmptyString(group.startDate)) errors.push('Informe a data da primeira parcela.');

  return errors;
}
