export function renderBadge({ label, tone = 'neutral' } = {}) {
  return `<span class="badge badge--${tone}">${label}</span>`;
}
