// Service Worker v1.0
// Cache everything and work offline

const CACHE_NAME = 'master-digital-v1';
const URLS_TO_CACHE = [
  '/',
  '/index.html',
  '/css/styles.css',
  '/js/script.js',
  '/manifest.json',
  'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 192 192"><rect fill="%231e293b" width="192" height="192"/></svg>'
];

// Install event
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      return cache.addAll(URLS_TO_CACHE).catch(() => {
        // Falha silenciosa se algum arquivo não existir
        return cache.addAll(URLS_TO_CACHE.filter(url => url.startsWith('/')));
      });
    })
  );
  self.skipWaiting();
});

// Activate event
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheName !== CACHE_NAME) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
  self.clients.claim();
});

// Fetch event - Cache first, then network
self.addEventListener('fetch', event => {
  const { request } = event;
  
  // Pular requisições não-GET
  if (request.method !== 'GET') {
    return;
  }
  
  // Pular requisições de extensões e scripts de content
  if (request.url.startsWith('chrome-extension:') || request.url.startsWith('moz-extension:')) {
    return;
  }

  event.respondWith(
    caches.match(request).then(response => {
      if (response) {
        return response;
      }
      
      return fetch(request).then(response => {
        // Não cachear requisições não-sucesso
        if (!response || response.status !== 200 || response.type !== 'basic') {
          return response;
        }

        const responseToCache = response.clone();
        caches.open(CACHE_NAME).then(cache => {
          cache.put(request, responseToCache);
        });

        return response;
      }).catch(() => {
        // Retornar página offline se disponível
        return caches.match('/index.html');
      });
    })
  );
});

// Background sync para notificações
self.addEventListener('sync', event => {
  if (event.tag === 'sync-notifications') {
    event.waitUntil(
      fetch('/api/notifications')
        .then(response => response.json())
        .then(data => {
          if (data.message) {
            self.registration.showNotification('Master Digital Growth', {
              body: data.message,
              badge: '/img/badge.png',
              icon: '/img/icon.png'
            });
          }
        })
        .catch(() => { /* Network error */ })
    );
  }
});

// Push notifications
self.addEventListener('push', event => {
  if (event.data) {
    const data = event.data.json();
    const options = {
      body: data.body || 'Confira a nova atualização',
      badge: '/img/badge.png',
      icon: '/img/icon.png',
      tag: 'notification',
      requireInteraction: false,
      actions: [
        { action: 'open', title: 'Abrir' },
        { action: 'close', title: 'Fechar' }
      ]
    };

    event.waitUntil(
      self.registration.showNotification(data.title || 'Master Digital Growth', options)
    );
  }
});

// Notificação click
self.addEventListener('notificationclick', event => {
  event.notification.close();
  
  if (event.action === 'open') {
    event.waitUntil(
      clients.matchAll({ type: 'window' }).then(clientList => {
        for (let client of clientList) {
          if (client.url === '/' && 'focus' in client) {
            return client.focus();
          }
        }
        if (clients.openWindow) {
          return clients.openWindow('/');
        }
      })
    );
  }
});

// Message handling
self.addEventListener('message', event => {
  if (event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
  
  if (event.data.type === 'LOG_ATTACK') {
    console.log('[SW] Attack detected:', event.data.details);
  }
});
