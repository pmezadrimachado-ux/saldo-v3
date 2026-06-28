import { formatCurrency } from '../../../utils/currency.js';

export function renderIncomeExpenseComparison(comparison) {
  const incomeWidth = Math.max(0, Math.min(comparison.incomePercentage, 100));
  const expenseWidth = Math.max(0, Math.min(comparison.expensePercentage, 100));

  return `
    <div class="comparison-card">
      <div class="comparison-card__row">
        <span>Receitas</span>
        <strong>${formatCurrency(comparison.income)}</strong>
      </div>
      <div class="comparison-card__track">
        <span class="comparison-card__income" style="width:${incomeWidth}%"></span>
      </div>

      <div class="comparison-card__row">
        <span>Despesas</span>
        <strong>${formatCurrency(comparison.expense)}</strong>
      </div>
      <div class="comparison-card__track">
        <span class="comparison-card__expense" style="width:${expenseWidth}%"></span>
      </div>
    </div>
  `;
}
