import { MAIN_NAV_ROUTES, ROUTE_LABELS, ROUTES } from '../../core/constants.js';
export function renderBottomNavigation(state) {
  return `<nav class="bottom-nav" aria-label="Navegação principal">${MAIN_NAV_ROUTES.map((route) => {
    const isActive = state.route.current === route; const isPrimary = route === ROUTES.QUICK_ADD;
    return `<a class="bottom-nav__item ${isActive ? 'bottom-nav__item--active' : ''} ${isPrimary ? 'bottom-nav__item--primary' : ''}" href="${route}" data-route="${route}" aria-current="${isActive ? 'page' : 'false'}"><span>${ROUTE_LABELS[route]}</span></a>`;
  }).join('')}</nav>`;
}
