import { renderCard } from '../components/base/card.component.js';

export function renderBackupPage({ state }) {
  return `
    <section class="page page--placeholder">
      <p class="page__eyebrow">Segurança</p>
      <h2>Backup</h2>
      <p>Exporte ou restaure seus dados locais. A importação substitui os dados atuais.</p>

      ${renderCard({
        eyebrow: 'Exportar',
        title: 'Salvar backup',
        description: 'Gera um arquivo JSON completo com seus dados.',
        content: `
          <button class="button button--primary" type="button" data-export-backup>
            Exportar backup
          </button>
        `,
      })}

      ${renderCard({
        eyebrow: 'Importar',
        title: 'Restaurar backup',
        description: 'Importar um backup substituirá todos os dados atuais deste dispositivo.',
        content: `
          <form class="entity-form" data-import-backup-form>
            <label class="field">
              <span class="field__label">Arquivo JSON</span>
              <input class="input" type="file" name="backupFile" accept="application/json,.json" required />
            </label>

            <button class="button button--danger" type="submit">
              Importar backup
            </button>
          </form>
        `,
      })}

      ${renderCard({
        eyebrow: 'Dados locais',
        title: 'Resumo atual',
        content: `
          <p class="card__description">
            Contas: ${state.data.accounts.length}<br />
            Categorias: ${state.data.categories.length}<br />
            Transações: ${state.data.transactions.length}<br />
            Orçamentos: ${state.data.budgets.length}<br />
            Metas: ${state.data.goals.length}<br />
            Parcelamentos: ${state.data.installmentGroups.length}
          </p>
        `,
      })}
    </section>
  `;
}
