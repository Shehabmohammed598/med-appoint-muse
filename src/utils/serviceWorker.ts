// Service Worker utilities for offline functionality

export function registerServiceWorker() {
  if ('serviceWorker' in navigator) {
    window.addEventListener('load', async () => {
      try {
        const registration = await navigator.serviceWorker.register('/sw.js');
        console.log('Service Worker registered successfully:', registration);

        // Listen for service worker updates
        registration.addEventListener('updatefound', () => {
          const newWorker = registration.installing;
          if (newWorker) {
            newWorker.addEventListener('statechange', () => {
              if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                // New service worker is available
                showUpdateNotification();
              }
            });
          }
        });

        // Handle service worker messages
        navigator.serviceWorker.addEventListener('message', (event) => {
          console.log('Message from service worker:', event.data);
          
          if (event.data.type === 'OFFLINE_BOOKING_SAVED') {
            showOfflineBookingNotification();
          }
        });

      } catch (error) {
        console.error('Service Worker registration failed:', error);
      }
    });
  }
}

export function unregisterServiceWorker() {
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.ready
      .then((registration) => {
        registration.unregister();
      })
      .catch((error) => {
        console.error('Service Worker unregistration failed:', error);
      });
  }
}

// Request background sync when offline
export function requestBackgroundSync(tag: string) {
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.ready.then((registration) => {
      // Use messaging instead of sync API for broader compatibility
      if (registration.active) {
        registration.active.postMessage({ type: 'BACKGROUND_SYNC', tag });
      }
    }).catch((error) => {
      console.error('Background sync registration failed:', error);
    });
  }
}

// Show update notification
function showUpdateNotification() {
  if ('Notification' in window && Notification.permission === 'granted') {
    new Notification('App Update Available', {
      body: 'A new version of the app is available. Refresh to update.',
      icon: '/favicon.ico',
      tag: 'app-update'
    });
  }
}

// Show offline booking notification
function showOfflineBookingNotification() {
  if ('Notification' in window && Notification.permission === 'granted') {
    new Notification('Booking Saved Offline', {
      body: 'Your booking has been saved and will be submitted when you\'re back online.',
      icon: '/favicon.ico',
      tag: 'offline-booking'
    });
  }
}

// Request notification permission
export function requestNotificationPermission() {
  if ('Notification' in window && Notification.permission === 'default') {
    Notification.requestPermission().then((permission) => {
      console.log('Notification permission:', permission);
    });
  }
}

// Cache management utilities
export async function clearAppCache() {
  if ('caches' in window) {
    const cacheNames = await caches.keys();
    await Promise.all(
      cacheNames.map((cacheName) => caches.delete(cacheName))
    );
    console.log('All caches cleared');
  }
}

export async function getCacheSize() {
  if ('caches' in window) {
    const cacheNames = await caches.keys();
    let totalSize = 0;
    
    for (const cacheName of cacheNames) {
      const cache = await caches.open(cacheName);
      const keys = await cache.keys();
      
      for (const request of keys) {
        const response = await cache.match(request);
        if (response) {
          const blob = await response.blob();
          totalSize += blob.size;
        }
      }
    }
    
    return totalSize;
  }
  
  return 0;
}

// Network quality detection
export function getNetworkQuality(): 'slow' | 'fast' | 'unknown' {
  const connection = (navigator as any).connection || 
                    (navigator as any).mozConnection || 
                    (navigator as any).webkitConnection;

  if (connection) {
    const { effectiveType, downlink } = connection;
    
    if (effectiveType === 'slow-2g' || effectiveType === '2g' || downlink < 0.5) {
      return 'slow';
    }
    
    if (effectiveType === '4g' || downlink > 2) {
      return 'fast';
    }
  }
  
  return 'unknown';
}

// Offline storage utilities
export const offlineStorage = {
  // Store booking data for offline use
  storeBooking: (bookingData: any) => {
    try {
      const bookings = JSON.parse(localStorage.getItem('offline_bookings') || '[]');
      bookings.push({
        ...bookingData,
        id: crypto.randomUUID(),
        timestamp: Date.now(),
        synced: false
      });
      localStorage.setItem('offline_bookings', JSON.stringify(bookings));
      
      // Register background sync
      requestBackgroundSync('sync-bookings');
      
      return true;
    } catch (error) {
      console.error('Failed to store offline booking:', error);
      return false;
    }
  },

  // Get all offline bookings
  getOfflineBookings: () => {
    try {
      return JSON.parse(localStorage.getItem('offline_bookings') || '[]');
    } catch (error) {
      console.error('Failed to get offline bookings:', error);
      return [];
    }
  },

  // Mark booking as synced
  markBookingSynced: (bookingId: string) => {
    try {
      const bookings = JSON.parse(localStorage.getItem('offline_bookings') || '[]');
      const updatedBookings = bookings.map((booking: any) => 
        booking.id === bookingId ? { ...booking, synced: true } : booking
      );
      localStorage.setItem('offline_bookings', JSON.stringify(updatedBookings));
      return true;
    } catch (error) {
      console.error('Failed to mark booking as synced:', error);
      return false;
    }
  },

  // Clear synced bookings older than 24 hours
  cleanupOldBookings: () => {
    try {
      const bookings = JSON.parse(localStorage.getItem('offline_bookings') || '[]');
      const oneDayAgo = Date.now() - (24 * 60 * 60 * 1000);
      
      const filteredBookings = bookings.filter((booking: any) => 
        !booking.synced || booking.timestamp > oneDayAgo
      );
      
      localStorage.setItem('offline_bookings', JSON.stringify(filteredBookings));
      return true;
    } catch (error) {
      console.error('Failed to cleanup old bookings:', error);
      return false;
    }
  }
};