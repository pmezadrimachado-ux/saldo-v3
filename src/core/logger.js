import { APP_CONFIG } from '../config/app.config.js';
function shouldLog() { return APP_CONFIG.enableDebugLogs === true; }
export function createLogger(scope) {
  const prefix = `[${scope}]`;
  return {
    debug(...args) { if (shouldLog()) console.debug(prefix, ...args); },
    info(...args) { if (shouldLog()) console.info(prefix, ...args); },
    warn(...args) { if (shouldLog()) console.warn(prefix, ...args); },
    error(...args) { console.error(prefix, ...args); },
  };
}
