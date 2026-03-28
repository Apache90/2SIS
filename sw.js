/* ═══════════════════════════════════════════════════════
   2SIS · Service Worker v1.0
   Apache90 · 2026
   
   Estrategia:
   - Cache-first para todos los assets de la app (offline total)
   - Actualización en background: si hay nueva versión en el servidor,
     la descarga silenciosamente y notifica al usuario
   - Versionar el cache: cambiar CACHE_VERSION fuerza re-descarga total
═══════════════════════════════════════════════════════ */

const CACHE_VERSION = '2sis-v1.0';
const CACHE_NAME = `2sis-cache-${CACHE_VERSION}`;

// Assets a cachear en la instalación (app shell)
const APP_SHELL = [
  './index.html',
  './manifest.json',
  // Google Fonts — se cachean en el primer request
  'https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&family=DM+Mono:wght@400;500&display=swap',
  // jsPDF CDN
  'https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js',
];

/* ── INSTALL ── */
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        // Cachear assets críticos (ignorar errores en recursos externos)
        return cache.addAll(APP_SHELL).catch(err => {
          console.warn('[2SIS SW] Algunos assets no se pudieron cachear:', err);
          // Cachear solo el HTML si fallan los externos
          return cache.add('./index.html');
        });
      })
      .then(() => {
        // Activar inmediatamente sin esperar al cierre de pestañas anteriores
        return self.skipWaiting();
      })
  );
});

/* ── ACTIVATE ── */
self.addEventListener('activate', event => {
  event.waitUntil(
    // Eliminar caches viejas
    caches.keys()
      .then(cacheNames => {
        return Promise.all(
          cacheNames
            .filter(name => name.startsWith('2sis-cache-') && name !== CACHE_NAME)
            .map(name => {
              console.log('[2SIS SW] Eliminando cache vieja:', name);
              return caches.delete(name);
            })
        );
      })
      .then(() => {
        // Tomar control de todas las pestañas abiertas
        return self.clients.claim();
      })
  );
});

/* ── FETCH — Estrategia cache-first con fallback a red ── */
self.addEventListener('fetch', event => {
  const url = new URL(event.request.url);
  
  // Solo manejar requests GET
  if (event.request.method !== 'GET') return;
  
  // Para navegación (el HTML principal): network-first para detectar actualizaciones
  if (event.request.mode === 'navigate') {
    event.respondWith(
      fetch(event.request)
        .then(networkResponse => {
          // Actualizar cache con la versión más reciente
          const clone = networkResponse.clone();
          caches.open(CACHE_NAME).then(cache => cache.put(event.request, clone));
          return networkResponse;
        })
        .catch(() => {
          // Sin red: servir desde cache
          return caches.match('./index.html');
        })
    );
    return;
  }
  
  // Para todos los demás assets: cache-first
  event.respondWith(
    caches.match(event.request)
      .then(cachedResponse => {
        if (cachedResponse) {
          // Está en cache: devolver inmediatamente + actualizar en background
          const fetchUpdate = fetch(event.request)
            .then(networkResponse => {
              if (networkResponse && networkResponse.status === 200) {
                caches.open(CACHE_NAME)
                  .then(cache => cache.put(event.request, networkResponse.clone()));
              }
            })
            .catch(() => {}); // Silenciar errores de red en background
          
          return cachedResponse;
        }
        
        // No está en cache: buscar en red y cachear
        return fetch(event.request)
          .then(networkResponse => {
            if (!networkResponse || networkResponse.status !== 200) {
              return networkResponse;
            }
            const clone = networkResponse.clone();
            caches.open(CACHE_NAME).then(cache => cache.put(event.request, clone));
            return networkResponse;
          })
          .catch(() => {
            // Offline y no en cache: respuesta vacía
            return new Response('', { status: 503, statusText: 'Offline' });
          });
      })
  );
});

/* ── MENSAJE desde la app ── */
self.addEventListener('message', event => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
  if (event.data && event.data.type === 'GET_VERSION') {
    event.ports[0].postMessage({ version: CACHE_VERSION });
  }
});
