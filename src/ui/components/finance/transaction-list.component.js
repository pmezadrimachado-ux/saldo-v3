import { formatCurrency } from '../../../utils/currency.js';
import { formatDateBR } from '../../../utils/date.js';

export function renderTransactionList({ transactions = [], accounts = [], categories = [] } = {}) {
  const visibleTransactions = transactions
    .filter((transaction) => transaction.deletedAt === null)
    .sort((a, b) => b.date.localeCompare(a.date) || b.createdAt.localeCompare(a.createdAt));

  if (!visibleTransactions.length) {
    return `<p class="card__description">Nenhum lançamento registrado.</p>`;
  }

  return `
    <div class="transaction-list">
      ${visibleTransactions.map((transaction) => {
        const account = accounts.find((item) => item.id === transaction.accountId);
        const category = categories.find((item) => item.id === transaction.categoryId);
        const sign = transaction.type === 'income' ? '+' : '-';

        return `
          <article class="transaction-item">
            <div>
              <strong>${transaction.description || category?.name || 'Lançamento'}</strong>
              <p>
                ${category?.name ?? 'Categoria arquivada'} •
                ${account?.name ?? 'Conta arquivada'} •
                ${formatDateBR(transaction.date)}
              </p>
            </div>

            <div class="transaction-item__side">
              <strong class="transaction-item__amount transaction-item__amount--${transaction.type}">
                ${sign} ${formatCurrency(transaction.amount)}
              </strong>

              <div class="transaction-item__actions">
                <button type="button" data-edit-transaction="${transaction.id}">Editar</button>
                <button type="button" data-delete-transaction="${transaction.id}">Excluir</button>
              </div>
            </div>
          </article>
        `;
      }).join('')}
    </div>
  `;
}
