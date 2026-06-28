const CACHE_NAME = 'saldo-v3-rc10-onboarding-redirect';
const APP_SHELL_ASSETS = ['./','./index.html','./manifest.webmanifest','./assets/pwa/icon.svg','./src/app/bootstrap.js','./src/app/app.js','./src/config/app.config.js','./src/config/pwa.config.js','./src/core/constants.js','./src/core/errors.js','./src/core/event-bus.js','./src/core/logger.js','./src/core/router.js','./src/core/state.js','./src/services/pwa.service.js','./src/ui/components/bottom-navigation.component.js','./src/ui/components/error-state.component.js','./src/ui/components/toast.component.js','./src/ui/layouts/app-shell.layout.js','./src/ui/pages/accounts.page.js','./src/ui/pages/analytics.page.js','./src/ui/pages/budgets.page.js','./src/ui/pages/categories.page.js','./src/ui/pages/dashboard.page.js','./src/ui/pages/goals.page.js','./src/ui/pages/onboarding.page.js','./src/ui/pages/quick-add.page.js','./src/ui/pages/settings.page.js','./src/ui/pages/transactions.page.js','./src/styles/tokens.css','./src/styles/base.css','./src/styles/components.css'];
self.addEventListener('install',(event)=>{event.waitUntil(caches.open(CACHE_NAME).then((cache)=>cache.addAll(APP_SHELL_ASSETS)).then(()=>self.skipWaiting()))});
self.addEventListener('activate',(event)=>{event.waitUntil(caches.keys().then((cacheNames)=>Promise.all(cacheNames.filter((cacheName)=>cacheName.startsWith('saldo-v3-')).filter((cacheName)=>cacheName!==CACHE_NAME).map((cacheName)=>caches.delete(cacheName)))).then(()=>self.clients.claim()))});
self.addEventListener('fetch',(event)=>{if(event.request.method!=='GET')return;event.respondWith(caches.match(event.request).then((cachedResponse)=>{if(cachedResponse)return cachedResponse;return fetch(event.request).then((networkResponse)=>{const sameOrigin=new URL(event.request.url).origin===self.location.origin;if(sameOrigin&&networkResponse.status===200){const clone=networkResponse.clone();caches.open(CACHE_NAME).then((cache)=>cache.put(event.request,clone))}return networkResponse}).catch(()=>caches.match('./index.html'))}))});

self.addEventListener('message', (event) => {
  if (event.data?.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});
