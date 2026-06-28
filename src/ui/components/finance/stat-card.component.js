export function renderStatCard({
  label,
  value,
  description = '',
  tone = 'neutral',
} = {}) {
  return `
    <article class="stat-card stat-card--${tone}">
      <p class="stat-card__label">${label}</p>
      <strong class="stat-card__value">${value}</strong>
      ${description ? `<p class="stat-card__description">${description}</p>` : ''}
    </article>
  `;
}
