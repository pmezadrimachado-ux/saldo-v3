import { formatCurrency } from '../../../utils/currency.js';
import { enrichGoals } from '../../../domain/goals/goal.calculations.js';

export function renderGoalList(goals = [], { emptyMessage = 'Nenhuma meta cadastrada.' } = {}) {
  if (!goals.length) {
    return `<p class="card__description">${emptyMessage}</p>`;
  }

  return `
    <div class="goal-list">
      ${enrichGoals(goals).map(renderGoalCard).join('')}
    </div>
  `;
}

export function renderGoalCard({ goal, progress }) {
  return `
    <article class="goal-card">
      <div class="goal-card__header">
        <div>
          <p>Meta</p>
          <strong>${goal.name}</strong>
        </div>
        <span>${progress.percentage}%</span>
      </div>

      <div class="goal-card__bar">
        <span style="width:${progress.percentage}%; background:${goal.color || '#A3FF12'}"></span>
      </div>

      <p class="goal-card__meta">
        ${formatCurrency(goal.currentAmount)} de ${formatCurrency(goal.targetAmount)} •
        faltam ${formatCurrency(progress.remaining)}
      </p>

      <p class="goal-card__meta">
        ${progress.daysRemaining === null ? 'Sem data alvo' : `${progress.daysRemaining} dia(s) restantes`}
        ${progress.monthlyRequired === null ? '' : ` • ${formatCurrency(progress.monthlyRequired)}/mês`}
      </p>

      <div class="goal-card__actions">
        <button type="button" data-edit-goal="${goal.id}">Editar</button>
        ${goal.status === 'archived'
          ? `<button type="button" data-reactivate-goal="${goal.id}">Reativar</button>`
          : `<button type="button" data-archive-goal="${goal.id}">Arquivar</button>`
        }
      </div>
    </article>
  `;
}
