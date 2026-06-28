import { initializeApp } from './app.js';
import { createLogger } from '../core/logger.js';
const logger = createLogger('Bootstrap');
window.addEventListener('DOMContentLoaded', () => {
  initializeApp().catch((error) => {
    logger.error('Falha crítica ao inicializar aplicação.', error);
    const root = document.querySelector('[data-app-root]');
    if (root) root.innerHTML = `<main class="fatal-error"><h1>Saldo</h1><h2>Não foi possível iniciar o app.</h2><p>Recarregue a página. Se o problema continuar, limpe o cache do navegador.</p></main>`;
  });
});
