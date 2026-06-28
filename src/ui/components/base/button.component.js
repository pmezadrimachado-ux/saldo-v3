export function renderButton({
  label,
  type = 'button',
  variant = 'primary',
  size = 'md',
  href = '',
  route = '',
  isDisabled = false,
  isLoading = false,
  extraClass = '',
} = {}) {
  const classes = [
    'button',
    `button--${variant}`,
    `button--${size}`,
    extraClass,
  ].filter(Boolean).join(' ');

  const content = `
    ${isLoading ? '<span class="button__spinner" aria-hidden="true"></span>' : ''}
    <span>${label}</span>
  `;

  if (href || route) {
    return `
      <a
        class="${classes}"
        href="${href || route}"
        ${route ? `data-route="${route}"` : ''}
        ${isDisabled ? 'aria-disabled="true"' : ''}
      >
        ${content}
      </a>
    `;
  }

  return `
    <button
      class="${classes}"
      type="${type}"
      ${isDisabled ? 'disabled' : ''}
      ${isLoading ? 'aria-busy="true"' : ''}
    >
      ${content}
    </button>
  `;
}
