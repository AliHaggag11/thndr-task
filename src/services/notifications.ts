export const initializeNotifications = async () => {
  if (!('Notification' in window)) {
    console.log('This browser does not support notifications');
    return false;
  }

  try {
    const permission = await Notification.requestPermission();
    if (permission === 'granted') {
      const registration = await navigator.serviceWorker.register('/service-worker.js');
      return registration;
    }
    return false;
  } catch (error) {
    console.error('Error registering service worker:', error);
    return false;
  }
};

export const subscribeToNotifications = async (registration: ServiceWorkerRegistration) => {
  try {
    const subscription = await registration.pushManager.subscribe({
      userVisibleOnly: true,
      // You would need to add your VAPID public key here
      applicationServerKey: 'YOUR_VAPID_PUBLIC_KEY'
    });

    // Here you would typically send the subscription to your backend
    console.log('Push notification subscription:', subscription);
    return subscription;
  } catch (error) {
    console.error('Error subscribing to push notifications:', error);
    return null;
  }
}; 