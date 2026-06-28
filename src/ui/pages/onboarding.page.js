import {
  SUGGESTED_ACCOUNTS,
  SUGGESTED_EXPENSE_CATEGORIES,
  SUGGESTED_INCOME_CATEGORIES,
} from '../../services/onboarding.service.js';
import { renderTextInput } from '../components/forms/text-input.component.js';

export function renderOnboardingPage() {
  return `
    <section class="page onboarding-page">
      <p class="page__eyebrow">Primeiro uso</p>
      <h2>Configure o Saldo</h2>
      <p>Escolha contas, cartões e categorias para começar. Seus dados ficam apenas neste dispositivo.</p>

      <form class="onboarding-form" data-onboarding-form>
        <section class="onboarding-step">
          <h3>1. Contas e cartões</h3>
          <p>Selecione sugestões ou adicione uma conta personalizada.</p>

          <div class="choice-grid">
            ${SUGGESTED_ACCOUNTS.map((account, index) => `
              <label class="choice-card">
                <input type="checkbox" name="accounts" value="${account.name}" ${index < 2 ? 'checked' : ''} />
                <span class="choice-card__dot" style="background:${account.color}"></span>
                <strong>${account.name}</strong>
              </label>
            `).join('')}
          </div>

          ${renderTextInput({
            name: 'customAccount',
            label: 'Conta personalizada opcional',
            placeholder: 'Ex.: Banco do Brasil, Carteira, Alelo',
          })}
        </section>

        <section class="onboarding-step">
          <h3>2. Categorias de despesa</h3>
          <p>Selecione as categorias que combinam com seu uso.</p>

          <div class="choice-grid">
            ${SUGGESTED_EXPENSE_CATEGORIES.map((category, index) => `
              <label class="choice-card">
                <input type="checkbox" name="expenseCategories" value="${category.name}" ${index < 6 ? 'checked' : ''} />
                <span class="choice-card__dot" style="background:${category.color}"></span>
                <strong>${category.name}</strong>
              </label>
            `).join('')}
          </div>

          ${renderTextInput({
            name: 'customExpenseCategory',
            label: 'Categoria personalizada opcional',
            placeholder: 'Ex.: Academia, Pet, Delivery',
          })}
        </section>

        <section class="onboarding-step">
          <h3>3. Categorias de receita</h3>
          <p>Selecione pelo menos uma categoria de receita.</p>

          <div class="choice-grid">
            ${SUGGESTED_INCOME_CATEGORIES.map((category, index) => `
              <label class="choice-card">
                <input type="checkbox" name="incomeCategories" value="${category.name}" ${index === 0 ? 'checked' : ''} />
                <span class="choice-card__dot" style="background:${category.color}"></span>
                <strong>${category.name}</strong>
              </label>
            `).join('')}
          </div>
        </section>

        <button class="button button--primary button--lg" type="submit">
          Finalizar configuração
        </button>
      </form>
    </section>
  `;
}
