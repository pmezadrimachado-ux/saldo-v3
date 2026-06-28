export class AppError extends Error {
  constructor(message, options = {}) { super(message); this.name = 'AppError'; this.code = options.code ?? 'APP_ERROR'; this.cause = options.cause; this.context = options.context ?? {}; }
}
export class RouteError extends AppError { constructor(message, options = {}) { super(message, { ...options, code: options.code ?? 'ROUTE_ERROR' }); this.name = 'RouteError'; } }
export class RenderError extends AppError { constructor(message, options = {}) { super(message, { ...options, code: options.code ?? 'RENDER_ERROR' }); this.name = 'RenderError'; } }
