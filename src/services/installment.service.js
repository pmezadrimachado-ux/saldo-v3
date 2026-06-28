import { installmentRepository } from '../repositories/installment.repository.js';
import { transactionRepository } from '../repositories/transaction.repository.js';
import { createInstallmentGroup, generateInstallmentTransactions } from '../domain/installments/installment.model.js';
import { validateInstallmentGroup } from '../domain/installments/installment.validators.js';

export async function addInstallmentGroup(input) {
  const group = createInstallmentGroup(input);
  const errors = validateInstallmentGroup(group);

  if (errors.length) {
    throw new Error(errors[0]);
  }

  const transactions = generateInstallmentTransactions(group);

  await Promise.all(transactions.map((transaction) => transactionRepository.save(transaction)));

  const savedGroup = {
    ...group,
    createdTransactionIds: transactions.map((transaction) => transaction.id),
  };

  await installmentRepository.save(savedGroup);

  return {
    group: savedGroup,
    transactions,
  };
}

export async function cancelInstallmentGroup(id) {
  const group = await installmentRepository.findById(id);

  if (!group) {
    throw new Error('Parcelamento não encontrado.');
  }

  return installmentRepository.save({
    ...group,
    status: 'canceled',
    canceledAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  });
}
