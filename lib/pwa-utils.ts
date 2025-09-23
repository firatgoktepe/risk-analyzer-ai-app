// PWA utility functions

export const registerServiceWorker = async () => {
    if ('serviceWorker' in navigator) {
        try {
            const registration = await navigator.serviceWorker.register('/sw.js');
            console.log('Service Worker registered successfully:', registration);

            // Handle updates
            registration.addEventListener('updatefound', () => {
                const newWorker = registration.installing;
                if (newWorker) {
                    newWorker.addEventListener('statechange', () => {
                        if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                            // New content is available, show update notification
                            if (confirm('New version available! Reload to update?')) {
                                window.location.reload();
                            }
                        }
                    });
                }
            });

            return registration;
        } catch (error) {
            console.error('Service Worker registration failed:', error);
        }
    }
};

export const unregisterServiceWorker = async () => {
    if ('serviceWorker' in navigator) {
        try {
            const registrations = await navigator.serviceWorker.getRegistrations();
            await Promise.all(registrations.map(registration => registration.unregister()));
            console.log('Service Workers unregistered');
        } catch (error) {
            console.error('Service Worker unregistration failed:', error);
        }
    }
};

export const isPWAInstalled = (): boolean => {
    return window.matchMedia('(display-mode: standalone)').matches ||
        (window.navigator as any).standalone === true ||
        document.referrer.includes('android-app://');
};

export const isOnline = (): boolean => {
    return navigator.onLine;
};

export const addOnlineStatusListener = (callback: (isOnline: boolean) => void) => {
    const handleOnline = () => callback(true);
    const handleOffline = () => callback(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
        window.removeEventListener('online', handleOnline);
        window.removeEventListener('offline', handleOffline);
    };
};

export const cacheData = async (key: string, data: any) => {
    if ('caches' in window) {
        try {
            const cache = await caches.open('work-safety-analyzer-data');
            await cache.put(key, new Response(JSON.stringify(data)));
        } catch (error) {
            console.error('Failed to cache data:', error);
        }
    }
};

export const getCachedData = async (key: string) => {
    if ('caches' in window) {
        try {
            const cache = await caches.open('work-safety-analyzer-data');
            const response = await cache.match(key);
            if (response) {
                return await response.json();
            }
        } catch (error) {
            console.error('Failed to get cached data:', error);
        }
    }
    return null;
};
