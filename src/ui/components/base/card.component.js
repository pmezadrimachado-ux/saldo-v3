export function renderCard({
  eyebrow = '',
  title = '',
  description = '',
  content = '',
  variant = 'default',
  extraClass = '',
} = {}) {
  return `
    <article class="card card--${variant} ${extraClass}">
      ${eyebrow ? `<p class="card__eyebrow">${eyebrow}</p>` : ''}
      ${title ? `<h3 class="card__title">${title}</h3>` : ''}
      ${description ? `<p class="card__description">${description}</p>` : ''}
      ${content ? `<div class="card__content">${content}</div>` : ''}
    </article>
  `;
}
