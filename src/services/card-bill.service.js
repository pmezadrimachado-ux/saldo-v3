import {
  buildCardBillSummary,
  buildInstallmentsByCard,
} from '../domain/cards/card-bill.calculations.js';

export function getCardBillData(state) {
  return {
    bills: buildCardBillSummary({
      accounts: state.data.accounts,
      transactions: state.data.transactions,
      monthKey: state.session.selectedMonth,
    }),
    installmentsByCard: buildInstallmentsByCard({
      accounts: state.data.accounts,
      transactions: state.data.transactions,
      monthKey: state.session.selectedMonth,
    }),
  };
}
