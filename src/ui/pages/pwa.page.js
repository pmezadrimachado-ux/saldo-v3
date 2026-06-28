import { renderCard } from '../components/base/card.component.js';

export function renderPwaPage({ state }) {
  const standalone = window.matchMedia('(display-mode: standalone)').matches || navigator.standalone === true;
  const serviceWorkerSupported = 'serviceWorker' in navigator;

  return `
    <section class="page page--placeholder">
      <p class="page__eyebrow">Instalação</p>
      <h2>PWA</h2>
      <p>Status de instalação, cache offline e versão do aplicativo.</p>

      ${renderCard({
        eyebrow: 'Status',
        title: standalone ? 'Instalado como app' : 'Rodando no navegador',
        content: `
          <p class="card__description">
            Service Worker: ${serviceWorkerSupported ? 'suportado' : 'não suportado'}<br />
            Modo offline: ${state.app.isOffline ? 'offline' : 'online'}<br />
            Versão: ${state.app.version}
          </p>
        `,
      })}

      ${renderCard({
        eyebrow: 'Como instalar',
        title: 'Adicionar à tela inicial',
        description: 'No Android, use o menu do Chrome e toque em Instalar app. No iPhone, use Compartilhar e depois Adicionar à Tela de Início.',
      })}
    </section>
  `;
}
