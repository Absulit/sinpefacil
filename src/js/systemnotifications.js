export async function requestNotificationPermission() {
    if (!('Notification' in window)) {
        return false;
    }

    const permission = await Notification.requestPermission();
    return permission === 'granted';
}

/**
 * 
 * @param {String} title 
 * @param {{body:String, icon:String, badge:String, vibrate:[], url:String}} options 
 * @returns 
 */
export async function sendSystemNotification(title, options = {}) {
    const { body, icon, badge, vibrate, url } = options;
    if (Notification.permission !== 'granted') {
        return;
    }

    const registration = await navigator.serviceWorker.ready;

    registration.showNotification(title, {
        body: body || '',
        icon: icon || '/icons/192x192.png',
        badge: badge || '', // Android monochrome status bar icon
        vibrate: vibrate || [100, 50, 100],
        data: {
            url: url || '/', // Path to open when clicked
        },
    });
}