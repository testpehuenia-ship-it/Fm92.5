self.addEventListener('install', (event) => {
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(clients.claim());
});

self.addEventListener('fetch', (event) => {
  // Simple pass-through for now, just to satisfy PWA installability requirements
});

self.addEventListener('push', function(event) {
  if (event.data) {
    try {
      const data = event.data.json();
      const options = {
        body: data.body,
        icon: data.icon || '/logo.png',
        badge: '/logo.png'
      };
      event.waitUntil(
        self.registration.showNotification(data.title, options)
      );
    } catch(e) {
      console.error('Error handling push', e);
    }
  }
});
