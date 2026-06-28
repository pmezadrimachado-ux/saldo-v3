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

      <form class="onboarding-form" data-onboarding-form novalidate>
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

          <div class="custom-add-row">
            ${renderTextInput({
              name: 'customAccount',
              label: 'Conta personalizada opcional',
              placeholder: 'Ex.: Banco do Brasil, Carteira, Alelo',
            })}
            <button class="button button--secondary" type="button" data-add-custom="accounts" data-input-name="customAccount">
              Adicionar
            </button>
          </div>

          <div class="custom-added-list" data-custom-list="accounts"></div>
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

          <div class="custom-add-row">
            ${renderTextInput({
              name: 'customExpenseCategory',
              label: 'Categoria de despesa personalizada opcional',
              placeholder: 'Ex.: Academia, Pet, Delivery',
            })}
            <button class="button button--secondary" type="button" data-add-custom="expenseCategories" data-input-name="customExpenseCategory">
              Adicionar
            </button>
          </div>

          <div class="custom-added-list" data-custom-list="expenseCategories"></div>
        </section>

        <section class="onboarding-step">
          <h3>3. Categorias de receita</h3>
          <p>Selecione pelo menos uma categoria de receita ou adicione uma personalizada.</p>

          <div class="choice-grid">
            ${SUGGESTED_INCOME_CATEGORIES.map((category, index) => `
              <label class="choice-card">
                <input type="checkbox" name="incomeCategories" value="${category.name}" ${index === 0 ? 'checked' : ''} />
                <span class="choice-card__dot" style="background:${category.color}"></span>
                <strong>${category.name}</strong>
              </label>
            `).join('')}
          </div>

          <div class="custom-add-row">
            ${renderTextInput({
              name: 'customIncomeCategory',
              label: 'Categoria de receita personalizada opcional',
              placeholder: 'Ex.: Bônus, Comissão, Venda',
            })}
            <button class="button button--secondary" type="button" data-add-custom="incomeCategories" data-input-name="customIncomeCategory">
              Adicionar
            </button>
          </div>

          <div class="custom-added-list" data-custom-list="incomeCategories"></div>
        </section>

        <button class="button button--primary button--lg" type="submit" data-onboarding-submit>
          Finalizar configuração
        </button>

        <p class="form-help">
          Use o botão Adicionar para incluir contas e categorias personalizadas antes de finalizar.
        </p>
      </form>
    </section>
  `;
}
