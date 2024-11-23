/// <reference lib="webworker" />

declare const self: ServiceWorkerGlobalScope;

self.addEventListener('push', (event) => {
  const options = {
    body: event.data?.text() ?? 'New stock update available',
    icon: '/NDAQ.png',
    badge: '/NDAQ.png',
    vibrate: [100, 50, 100],
    data: {
      dateOfArrival: Date.now(),
      primaryKey: '1'
    },
    actions: [
      {
        action: 'explore',
        title: 'View Details',
      },
      {
        action: 'close',
        title: 'Close',
      },
    ]
  };

  event.waitUntil(
    self.registration.showNotification('NASDAQ Stock Update', options)
  );
});

self.addEventListener('notificationclick', (event) => {
  event.notification.close();

  if (event.action === 'explore') {
    // Handle explore action
    event.waitUntil(
      self.clients.openWindow('/')
    );
  }
});

export {}; 