import { ROUTES } from '../../core/constants.js';
import { renderCard } from '../components/base/card.component.js';

export function renderSettingsPage({ state }) {
  return `
    <section class="page page--placeholder">
      <p class="page__eyebrow">Configuração</p>
      <h2>Ajustes</h2>
      <p>Administração do aplicativo, backup, preferências e versão.</p>

      <div class="settings-grid">
        <a class="settings-link" href="${ROUTES.ACCOUNTS}" data-route="${ROUTES.ACCOUNTS}">Contas e Cartões</a>
        <a class="settings-link" href="${ROUTES.CATEGORIES}" data-route="${ROUTES.CATEGORIES}">Categorias</a>
        <a class="settings-link" href="${ROUTES.BUDGETS}" data-route="${ROUTES.BUDGETS}">Orçamentos</a>
        <a class="settings-link" href="${ROUTES.GOALS}" data-route="${ROUTES.GOALS}">Metas</a>
        <a class="settings-link" href="${ROUTES.INSTALLMENTS}" data-route="${ROUTES.INSTALLMENTS}">Parcelamentos</a>
        <a class="settings-link" href="${ROUTES.BACKUP}" data-route="${ROUTES.BACKUP}">Backup</a>
        <a class="settings-link" href="${ROUTES.PWA}" data-route="${ROUTES.PWA}">PWA</a>
        <a class="settings-link" href="${ROUTES.TESTS}" data-route="${ROUTES.TESTS}">Testes</a>
      </div>

      ${renderCard({
        eyebrow: 'Banco local',
        title: state.data.metadata ? 'IndexedDB ativo' : 'Inicializando',
        content: `
          <p class="card__description">
            Banco: saldoDB<br />
            Schema: ${state.data.metadata?.schemaVersion ?? '-'}<br />
            Contas: ${state.data.accounts.length}<br />
            Categorias: ${state.data.categories.length}<br />
            Transações: ${state.data.transactions.length}
          </p>
        `,
      })}

      <article class="version-card">
        <span>Versão</span>
        <strong>${state.app.version}</strong>
      </article>
    </section>
  `;
}
