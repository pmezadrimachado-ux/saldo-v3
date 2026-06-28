import { renderCard } from '../components/base/card.component.js';
import { renderInstallmentList } from '../components/finance/installment-card.component.js';

export function renderInstallmentsPage({ state }) {
  const accounts = state.data.accounts.filter((account) => account.isActive);
  const categories = state.data.categories.filter((category) => category.isActive && category.type === 'expense');

  return `
    <section class="page page--placeholder">
      <p class="page__eyebrow">Parcelamentos</p>
      <h2>Compras parceladas</h2>
      <p>Cadastre uma compra uma vez e o Saldo gera as parcelas futuras automaticamente. Se a conta for cartão de crédito, as parcelas também aparecem nas faturas mensais.</p>

      ${renderCard({
        eyebrow: 'Novo parcelamento',
        title: 'Adicionar compra parcelada',
        content: `
          <form class="entity-form" data-installment-form>
            <label class="field">
              <span class="field__label">Descrição</span>
              <input class="input" name="description" placeholder="Ex.: Notebook, celular, viagem" required />
            </label>

            <label class="field">
              <span class="field__label">Valor total</span>
              <input class="input" name="totalAmount" inputmode="decimal" placeholder="Ex.: 3600" required />
            </label>

            <label class="field">
              <span class="field__label">Número de parcelas</span>
              <input class="input" name="installmentCount" inputmode="numeric" placeholder="Ex.: 12" required />
            </label>

            <label class="field">
              <span class="field__label">Conta ou cartão</span>
              <select class="input" name="accountId" required>
                ${accounts.map((account) => `<option value="${account.id}">${account.name}</option>`).join('')}
              </select>
            </label>

            <label class="field">
              <span class="field__label">Categoria</span>
              <select class="input" name="categoryId" required>
                ${categories.map((category) => `<option value="${category.id}">${category.name}</option>`).join('')}
              </select>
            </label>

            <label class="field">
              <span class="field__label">Data da primeira parcela</span>
              <input class="input" type="date" name="startDate" required />
            </label>

            <button class="button button--primary" type="submit">Gerar parcelas</button>
          </form>
        `,
      })}

      ${renderCard({
        eyebrow: 'Ativos',
        title: `${state.data.installmentGroups.filter((item) => item.status === 'active').length} parcelamento(s)`,
        content: renderInstallmentList(state.data.installmentGroups),
      })}
    </section>
  `;
}
