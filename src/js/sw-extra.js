import i18next from 'i18next';

// if the user clicks notif then return back to app
self.addEventListener('notificationclick', e => {
    e.notification.close();

    const targetUrl = e.notification.data?.url || '/';

    e.waitUntil(
        clients
            .matchAll({ type: 'window', includeUncontrolled: true })
            .then((clientList) => {
                for (const client of clientList) {
                    if (client.url.includes(targetUrl) && 'focus' in client) {
                        return client.focus();
                    }
                }
                if (clients.openWindow) {
                    return clients.openWindow(targetUrl);
                }
            })
    );
});


self.addEventListener('activate', (event) => {
    event.waitUntil(
        (async () => {
            // await self.clients.claim();

            const permission = await self.registration.pushManager.permissionState({
                userVisibleOnly: true,
            });

            if (Notification.permission === 'granted') {
                // if (permission === 'granted') {
                await self.registration.showNotification('App Updated!', {
                    body: i18next.t('updateDownloaded'),
                    icon: '/icons/192x192.png',
                    badge: '/icons/128x128.png',
                    data: { url: '/' },
                });
            }
        })()
    );
});

// listen for the periodic sync from sw-extra.js
self.addEventListener('periodicsync', (event) => {
    if (event.tag === 'check-app-update') {
        event.waitUntil(self.registration.update()); 
    }
});
