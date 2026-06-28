import { renderCard } from '../components/base/card.component.js';
import { renderGoalList } from '../components/finance/goal-card.component.js';

export function renderGoalsPage({ state }) {
  const activeGoals = state.data.goals.filter((goal) => goal.status !== 'archived');
  const archivedGoals = state.data.goals.filter((goal) => goal.status === 'archived');

  return `
    <section class="page page--placeholder">
      <p class="page__eyebrow">Objetivos</p>
      <h2>Metas</h2>
      <p>Crie objetivos financeiros e acompanhe quanto falta para alcançá-los.</p>

      ${renderCard({
        eyebrow: 'Nova meta',
        title: 'Adicionar objetivo',
        content: `
          <form class="entity-form" data-goal-form>
            <label class="field">
              <span class="field__label">Nome</span>
              <input class="input" name="name" placeholder="Ex.: Viagem, Notebook, Reserva" required />
            </label>

            <label class="field">
              <span class="field__label">Valor alvo</span>
              <input class="input" name="targetAmount" inputmode="decimal" placeholder="Ex.: 15000" required />
            </label>

            <label class="field">
              <span class="field__label">Valor atual</span>
              <input class="input" name="currentAmount" inputmode="decimal" placeholder="Ex.: 2500" />
            </label>

            <label class="field">
              <span class="field__label">Data alvo</span>
              <input class="input" type="date" name="targetDate" />
            </label>

            <label class="field">
              <span class="field__label">Cor</span>
              <input class="input input--color" type="color" name="color" value="#A3FF12" />
            </label>

            <button class="button button--primary" type="submit">Criar meta</button>
          </form>
        `,
      })}

      ${renderCard({
        eyebrow: 'Ativas',
        title: `${activeGoals.length} meta(s)`,
        content: renderGoalList(activeGoals, {
          emptyMessage: 'Nenhuma meta ativa.',
        }),
      })}

      ${renderCard({
        eyebrow: 'Arquivadas',
        title: `${archivedGoals.length} arquivada(s)`,
        content: renderGoalList(archivedGoals, {
          emptyMessage: 'Nenhuma meta arquivada.',
        }),
      })}
    </section>
  `;
}
