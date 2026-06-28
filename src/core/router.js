import { APP_CONFIG } from '../config/app.config.js';
import { EVENT_NAMES, ROUTES } from './constants.js';
import { RouteError } from './errors.js';
import { createLogger } from './logger.js';

const logger = createLogger('Router');

export function createRouter({ state, eventBus, setRoute }) {
  const knownRoutes = new Set(Object.values(ROUTES));

  function normalizeRoute(route) {
    if (!route) return APP_CONFIG.defaultRoute;

    return route.startsWith('#/') ? route : `#/${route.replace(/^#?\/?/, '')}`;
  }

  function isKnownRoute(route) {
    return knownRoutes.has(route);
  }

  function getCurrentRoute() {
    const route = normalizeRoute(window.location.hash || APP_CONFIG.defaultRoute);

    if (!isKnownRoute(route)) {
      logger.warn('Rota desconhecida:', route);
      return APP_CONFIG.defaultRoute;
    }

    return route;
  }

  function getAllowedRoute(route) {
    if (!state.onboarding.completed && route !== ROUTES.ONBOARDING) {
      return ROUTES.ONBOARDING;
    }

    if (state.onboarding.completed && route === ROUTES.ONBOARDING) {
      return APP_CONFIG.defaultRoute;
    }

    return route;
  }

  function resolveRoute(route) {
    const normalizedRoute = normalizeRoute(route);

    if (!isKnownRoute(normalizedRoute)) {
      throw new RouteError(`Rota desconhecida: ${normalizedRoute}`, {
        context: { route: normalizedRoute },
      });
    }

    return getAllowedRoute(normalizedRoute);
  }

  function navigate(route, options = {}) {
    const resolvedRoute = resolveRoute(route);

    setRoute(state, resolvedRoute);

    if (window.location.hash !== resolvedRoute) {
      if (options.replace) {
        window.history.replaceState(null, '', resolvedRoute);
      } else {
        window.history.pushState(null, '', resolvedRoute);
      }
    }

    eventBus.emit(EVENT_NAMES.ROUTE_CHANGED, {
      route: resolvedRoute,
      previous: state.route.previous,
    });
  }

  function syncFromLocation() {
    const route = getAllowedRoute(getCurrentRoute());

    setRoute(state, route);

    if (window.location.hash !== route) {
      window.history.replaceState(null, '', route);
    }

    eventBus.emit(EVENT_NAMES.ROUTE_CHANGED, {
      route,
      previous: state.route.previous,
    });
  }

  function start() {
    window.addEventListener('hashchange', syncFromLocation);
    window.addEventListener('popstate', syncFromLocation);

    syncFromLocation();
  }

  return {
    start,
    navigate,
    getCurrentRoute,
    isKnownRoute,
    resolveRoute,
    syncFromLocation,
  };
}
