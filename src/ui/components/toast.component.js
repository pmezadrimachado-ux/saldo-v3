export function renderToast(toast) {
  if (!toast) return '';
  return `<div class="toast toast--${toast.type}" role="status" aria-live="polite"><span>${toast.message}</span><button class="toast__close" type="button" data-dismiss-toast aria-label="Fechar aviso">×</button></div>`;
}
