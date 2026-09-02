import $ from 'dom7';
import Framework7 from 'framework7/bundle';


// Import F7 Styles
import 'framework7/css/bundle';

// Import Icons and App Custom Styles
import '../css/icons.css';
import '../css/app.css';

import routes from './routes.js';
import store from './store.js';

// Import main app component
import App from '../app.f7';
import { initI18n } from 'i18n';
import generateSINPESMS, { SMS_START, validateSMS } from 'sms';
import { db, getOption, saveOption, Keys } from 'db';
import { clearParams } from 'url';
import i18next from 'i18next';
import {
    requestNotificationPermission,
    sendSystemNotification
} from 'systemnotifications';

await initI18n();

store.dispatch('initApp').then(() => {

    const app = new Framework7({
        name: 'SINPE Fácil', // App name
        theme: 'auto', // Automatic theme detection
        darkMode: 'auto',

        el: '#app', // App root element
        component: App, // App main component
        store,
        routes,

        view: {
            pushState: true,
            pushStateSeparator: '#!',
            pushStateOnPop: true,
            pushStatePreventOnMainPage: true,
        },

        on: {
            init: async () => {
                const urlParams = new URLSearchParams(window.location.search);
                const data = Object.fromEntries(urlParams.entries());
                const { phone, name, price, detail } = data;
                const linkShared = phone && name && price;
                const bankId = await getOption(Keys.SELECTED_BANK);

                if (!bankId && linkShared) { // new user, no bank, we ask for it

                    const isValid = validateSMS(SMS_START, price, phone, name, detail);
                    if (!isValid) {
                        app.dialog.confirm(i18next.t('validation:linkLength'), 'SINPE Fácil')
                        return;
                    }

                    app.dialog.confirm(
                        i18next.t('read:CTASelectBank'),
                        'SINPE Fácil',
                        async () => { // ok
                            const banks = await db.banks.toArray();
                            const options = banks.map(bank => {
                                return { text: bank.name, onClick: () => handleSelect(bank.id, data) }
                            })

                            // list of banks dropdown
                            app.actions.create({
                                buttons: [
                                    options,
                                    [
                                        { text: i18next.t('cancel'), color: 'red' }
                                    ]
                                ]
                            }).open();
                        },
                        () => { // cancel
                            const tabLink = document.querySelectorAll('.tab-link')[0]
                            app.tab.show(`#view-home`, tabLink, true);
                            clearParams();
                        }
                    );

                    return; // exit and SMS will be called after selecting bank
                }

                if (linkShared) {
                    const bank = await db.banks.get(bankId);
                    clearParams();
                    console.log('---- validate link');

                    store.dispatch('addHistoryItem', { price, phone, name, detail, createdAt: new Date() })
                    generateSINPESMS(bank.phone, price, phone, name, detail);
                }

            },
            pageAfterIn: page => {
                if (typeof gtag === 'function') {
                    gtag('event', 'page_view', {
                        page_title: page.name,
                        page_location: window.location.href,
                        page_path: page.router.currentRoute.url
                    });
                }
            }
        },

        // Register service worker (only on production build)
        serviceWorker: process.env.NODE_ENV === 'production' ? {
            path: 'service-worker.js',
        } : {},
    });

    // BACK BUTTON: initial state
    let isExiting = false;
    if (!window.history.state) {
        window.history.replaceState({ isInitial: true, tabId: document.querySelector('.tab-active')?.id }, '');
    }

    // BACK BUTTON: This enables the back button on tabs
    app.on('tabShow', function (tabEl) {
        // adds entry to the history
        if (!window.history.state || window.history.state.tabId !== tabEl.id) {
            safePushState({ tabId: tabEl.id }, '');
        }
        if (typeof gtag === 'function') {
            const tabId = tabEl.getAttribute('id') || tabEl.dataset.name || 'unknown-tab';
            gtag('event', 'page_view', {
                page_title: `Tab: ${tabId}`,
                page_location: `${window.location.origin}/#${tabId}`,
                page_path: `/#${tabId}`
            });
        }



    });

    // BACK BUTTON: change in history
    window.addEventListener('popstate', function (e) {
        if (isExiting) return;
        const activeView = app.views.current || app.views.main;

        // if a page like `/settings/` return via f7
        if (activeView && activeView.history.length > 1) {
            activeView.router.back();
            return;
        }

        if (e.state && e.state.tabId) {
            // load previous tab
            app.tab.show('#' + e.state.tabId, false);
        }

        if (e.state && e.state.isInitial) {
            window.history.pushState({ isInitial: true, tabId: document.querySelector('.tab-active')?.id }, '');
            // TODO: ask user to exit
        }

    });

    navigator.serviceWorker?.ready.then(registration => {
        registration.addEventListener('updatefound', () => {
            const newWorker = registration.installing;

            newWorker.addEventListener('statechange', async () => {
                if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {

                    const body = i18next.t('updateAvailable');

                    // show CTA
                    app.toast.create({
                        text: body,
                        position: 'top', // 'top' | 'center' | 'bottom'
                        closeButton: true,
                        closeButtonText: 'OK'
                    }).open();

                }
            });
        });
    });

});

/**
 * 
 * @param {Number} bankId 
 * @param {{price, phone, name, detail}} payload 
 */
async function handleSelect(bankId, { price, phone, name, detail },) {
    const bank = await db.banks.get(bankId);
    saveOption(Keys.SELECTED_BANK, bankId); // save bank for future links
    clearParams();
    generateSINPESMS(bank.phone, price, phone, name, detail);
}


/**
 * to avoid a warning on the console
 * basically a wrapper
 */
function safePushState(stateObj, title, url) {
    try {
        if (window.history.length > 0) {
            window.history.pushState(stateObj, title, url);
        } else {
            window.history.replaceState(stateObj, title, url);
        }
    } catch (e) {
        window.history.replaceState(stateObj, title, url);
    }
}


// it is a bad practive to send a notification to the user
// to let them know about a non actionable update
async function registerBackgroundUpdateCheck() {
    const registration = await navigator.serviceWorker.ready;

    if ('periodicSync' in registration) {
        try {
            // Request browser to check for SW updates every 12 hours in background
            await registration.periodicSync.register('check-app-update', {
                minInterval: 12 * 60 * 60 * 1000, // 12 hours
            });
        } catch (error) {
            console.log('Periodic background sync not allowed or supported.');
        }
    }
}
// registerBackgroundUpdateCheck()

// let refreshing = false;
// navigator.serviceWorker.addEventListener('controllerchange', () => {
//     if (!refreshing) {
//         refreshing = true;
//         window.location.reload();
//     }
// });


