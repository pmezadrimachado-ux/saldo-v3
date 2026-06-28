export function renderEmptyState({
  title = 'Nada por aqui.',
  description = 'Os dados aparecerão quando você começar a usar o app.',
  action = '',
} = {}) {
  return `
    <section class="empty-state">
      <div class="empty-state__icon" aria-hidden="true">○</div>
      <h3>${title}</h3>
      <p>${description}</p>
      ${action}
    </section>
  `;
}
