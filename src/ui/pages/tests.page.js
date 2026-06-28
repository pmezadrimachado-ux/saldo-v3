import { renderCard } from '../components/base/card.component.js';
import { getDiagnostics } from '../../services/diagnostics.service.js';

const CHECKLIST = [
  'Concluir onboarding',
  'Criar conta/cartão',
  'Criar categoria',
  'Lançar despesa rápida',
  'Lançar receita',
  'Editar lançamento',
  'Excluir lançamento',
  'Criar orçamento',
  'Criar meta',
  'Criar parcelamento',
  'Validar Dashboard',
  'Validar Análises',
  'Exportar backup',
  'Importar backup',
  'Abrir app offline',
  'Instalar como PWA'
];

export function renderTestsPage({ state }) {
  const diagnostics = getDiagnostics(state);

  return `
    <section class="page page--placeholder">
      <p class="page__eyebrow">Qualidade</p>
      <h2>Testes</h2>
      <p>Checklist operacional para validar o aplicativo antes da versão estável.</p>

      ${renderCard({
        eyebrow: 'Diagnóstico',
        title: `Complexidade ${diagnostics.estimatedComplexity}`,
        content: `
          <p class="card__description">
            Versão: ${diagnostics.appVersion}<br />
            Ambiente: ${diagnostics.environment}<br />
            Online: ${diagnostics.online ? 'sim' : 'não'}<br />
            Service Worker: ${diagnostics.serviceWorkerSupported ? 'suportado' : 'não suportado'}<br />
            IndexedDB: ${diagnostics.indexedDbSupported ? 'suportado' : 'não suportado'}<br />
            Instalado: ${diagnostics.standalone ? 'sim' : 'não'}
          </p>
        `,
      })}

      ${renderCard({
        eyebrow: 'Dados',
        title: 'Volume atual',
        content: `
          <p class="card__description">
            Contas: ${diagnostics.counts.accounts}<br />
            Categorias: ${diagnostics.counts.categories}<br />
            Transações: ${diagnostics.counts.transactions}<br />
            Orçamentos: ${diagnostics.counts.budgets}<br />
            Metas: ${diagnostics.counts.goals}<br />
            Parcelamentos: ${diagnostics.counts.installmentGroups}
          </p>
        `,
      })}

      ${renderCard({
        eyebrow: 'Checklist',
        title: 'Validação manual',
        content: `
          <div class="test-checklist">
            ${CHECKLIST.map((item, index) => `
              <label>
                <input type="checkbox" />
                <span>${index + 1}. ${item}</span>
              </label>
            `).join('')}
          </div>
        `,
      })}
    </section>
  `;
}
