let toastTimeoutId = null;

export function ensureToastHost() {
  let host = document.querySelector('[data-toast-host]');

  if (host) {
    return host;
  }

  host = document.createElement('div');
  host.className = 'toast-host';
  host.dataset.toastHost = 'true';
  host.setAttribute('aria-live', 'polite');
  host.setAttribute('aria-atomic', 'true');

  document.body.appendChild(host);

  return host;
}

export function showDomToast({
  type = 'info',
  message = '',
  duration = 3200,
} = {}) {
  const host = ensureToastHost();

  if (toastTimeoutId) {
    window.clearTimeout(toastTimeoutId);
    toastTimeoutId = null;
  }

  host.innerHTML = `
    <div class="toast toast--${type}" role="status">
      <span>${message}</span>
      <button class="toast__close" type="button" aria-label="Fechar aviso" data-toast-close>×</button>
    </div>
  `;

  host.querySelector('[data-toast-close]')?.addEventListener('click', () => {
    clearDomToast();
  });

  if (type !== 'error') {
    toastTimeoutId = window.setTimeout(() => {
      clearDomToast();
    }, duration);
  }
}

export function clearDomToast() {
  const host = document.querySelector('[data-toast-host]');

  if (!host) {
    return;
  }

  host.innerHTML = '';

  if (toastTimeoutId) {
    window.clearTimeout(toastTimeoutId);
    toastTimeoutId = null;
  }
}
