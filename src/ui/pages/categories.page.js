import { renderCard } from '../components/base/card.component.js';
import { renderEntityList } from '../components/finance/entity-list.component.js';

export function renderCategoriesPage({ state }) {
  const activeCategories = state.data.categories.filter((category) => category.isActive);
  const archivedCategories = state.data.categories.filter((category) => !category.isActive);

  return `
    <section class="page page--placeholder">
      <p class="page__eyebrow">Organização</p>
      <h2>Categorias</h2>
      <p>Crie, edite, arquive e reative categorias sem perder histórico.</p>

      ${renderCard({
        eyebrow: 'Nova categoria',
        title: 'Adicionar categoria',
        content: `
          <form class="entity-form" data-category-form>
            <label class="field">
              <span class="field__label">Nome</span>
              <input class="input" name="name" placeholder="Ex.: Pet, Academia, Delivery" required />
            </label>

            <label class="field">
              <span class="field__label">Tipo</span>
              <select class="input" name="type" required>
                <option value="expense">Despesa</option>
                <option value="income">Receita</option>
              </select>
            </label>

            <label class="field">
              <span class="field__label">Cor</span>
              <input class="input input--color" type="color" name="color" value="#A3FF12" />
            </label>

            <button class="button button--primary" type="submit">Criar</button>
          </form>
        `,
      })}

      ${renderCard({
        eyebrow: 'Ativas',
        title: `${activeCategories.length} categoria(s)`,
        content: renderEntityList({
          items: activeCategories,
          type: 'category',
          emptyMessage: 'Nenhuma categoria ativa.',
        }),
      })}

      ${renderCard({
        eyebrow: 'Arquivadas',
        title: `${archivedCategories.length} arquivada(s)`,
        content: renderEntityList({
          items: archivedCategories,
          type: 'category',
          emptyMessage: 'Nenhuma categoria arquivada.',
        }),
      })}
    </section>
  `;
}
