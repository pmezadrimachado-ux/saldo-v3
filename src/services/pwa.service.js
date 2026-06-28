import { PWA_CONFIG } from '../config/pwa.config.js';
import { createLogger } from '../core/logger.js';
const logger = createLogger('PWA');
export function canUseServiceWorker() { return PWA_CONFIG.enabled && 'serviceWorker' in navigator; }
export async function registerServiceWorker() {
  if (!canUseServiceWorker()) return { registered: false, reason: 'SERVICE_WORKER_UNAVAILABLE' };
  try { const registration = await navigator.serviceWorker.register(PWA_CONFIG.serviceWorkerPath); logger.info('Service Worker registrado.'); return { registered: true, registration }; }
  catch (error) { logger.warn('Falha ao registrar Service Worker.', error); return { registered: false, reason: 'SERVICE_WORKER_REGISTRATION_FAILED', error }; }
}
