import { EVENT_NAMES } from '../core/constants.js';

let waitingWorker = null;

export function watchForPwaUpdates(eventBus) {
  if (!('serviceWorker' in navigator)) return;

  navigator.serviceWorker.addEventListener('controllerchange', () => {
    window.location.reload();
  });

  navigator.serviceWorker.ready.then((registration) => {
    registration.addEventListener('updatefound', () => {
      const worker = registration.installing;

      if (!worker) return;

      worker.addEventListener('statechange', () => {
        if (worker.state === 'installed' && navigator.serviceWorker.controller) {
          waitingWorker = worker;

          eventBus.emit(EVENT_NAMES.TOAST_SHOW, {
            toast: {
              type: 'info',
              message: 'Nova versão disponível. Feche e abra o app para atualizar.',
            },
          });
        }
      });
    });
  });
}

export function applyWaitingUpdate() {
  if (!waitingWorker) return false;

  waitingWorker.postMessage({ type: 'SKIP_WAITING' });
  return true;
}
