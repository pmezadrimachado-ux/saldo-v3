export function renderSkeleton({ lines = 3 } = {}) {
  return `
    <div class="skeleton" aria-hidden="true">
      ${Array.from({ length: lines }).map(() => '<span></span>').join('')}
    </div>
  `;
}
