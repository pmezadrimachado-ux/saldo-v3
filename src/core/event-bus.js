import { createLogger } from './logger.js';
const logger = createLogger('EventBus');
export function createEventBus() {
  const listeners = new Map();
  function on(eventName, handler) { if (!listeners.has(eventName)) listeners.set(eventName, new Set()); listeners.get(eventName).add(handler); return () => off(eventName, handler); }
  function off(eventName, handler) { listeners.get(eventName)?.delete(handler); }
  function emit(eventName, payload = {}) { logger.debug('emit', eventName, payload); listeners.get(eventName)?.forEach((handler) => { try { handler(payload); } catch (error) { logger.error(`Erro em handler do evento ${eventName}`, error); } }); }
  function clear() { listeners.clear(); }
  return { on, off, emit, clear };
}
