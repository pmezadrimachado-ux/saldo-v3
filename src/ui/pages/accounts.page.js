import { renderCard } from '../components/base/card.component.js';
import { renderEntityList } from '../components/finance/entity-list.component.js';

export function renderAccountsPage({ state }) {
  const activeAccounts = state.data.accounts.filter((account) => account.isActive);
  const archivedAccounts = state.data.accounts.filter((account) => !account.isActive);

  return `
    <section class="page page--placeholder">
      <p class="page__eyebrow">Entidades</p>
      <h2>Contas e Cartões</h2>
      <p>Crie, edite, arquive e reative contas e cartões sem perder histórico.</p>

      ${renderCard({
        eyebrow: 'Nova entidade',
        title: 'Adicionar conta ou cartão',
        content: `
          <form class="entity-form" data-account-form>
            <label class="field">
              <span class="field__label">Nome</span>
              <input class="input" name="name" placeholder="Ex.: Nubank, Itaú, Dinheiro" required />
            </label>

            <label class="field">
              <span class="field__label">Tipo</span>
              <select class="input" name="type" required>
                <option value="checking_account">Conta corrente</option>
                <option value="credit_card">Cartão de crédito</option>
                <option value="debit_card">Cartão de débito</option>
                <option value="cash">Dinheiro</option>
                <option value="benefit">Benefício</option>
                <option value="wallet">Carteira</option>
                <option value="other">Outro</option>
              </select>
            </label>

            <label class="field">
              <span class="field__label">Cor</span>
              <input class="input input--color" type="color" name="color" value="#A3FF12" />
            </label>

            <label class="field">
              <span class="field__label">Saldo inicial</span>
              <input class="input" name="initialBalance" inputmode="decimal" placeholder="0" />
            </label>

            <label class="field">
              <span class="field__label">Limite do cartão</span>
              <input class="input" name="creditLimit" inputmode="decimal" placeholder="Opcional" />
            </label>

            <label class="field">
              <span class="field__label">Dia de fechamento</span>
              <input class="input" name="closingDay" inputmode="numeric" placeholder="Ex.: 5" />
            </label>

            <label class="field">
              <span class="field__label">Dia de vencimento</span>
              <input class="input" name="dueDay" inputmode="numeric" placeholder="Ex.: 12" />
            </label>

            <button class="button button--primary" type="submit">Criar</button>
          </form>
        `,
      })}

      ${renderCard({
        eyebrow: 'Ativos',
        title: `${activeAccounts.length} conta(s)/cartão(ões)`,
        content: renderEntityList({
          items: activeAccounts,
          type: 'account',
          emptyMessage: 'Nenhuma conta ativa.',
        }),
      })}

      ${renderCard({
        eyebrow: 'Arquivados',
        title: `${archivedAccounts.length} arquivado(s)`,
        content: renderEntityList({
          items: archivedAccounts,
          type: 'account',
          emptyMessage: 'Nenhuma conta arquivada.',
        }),
      })}
    </section>
  `;
}
