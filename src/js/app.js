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
import { initI18n } from './i18n.js';
import generateSINPESMS from 'sms';
import { db, getOption, saveOption, Keys } from 'db';
import { clearParams } from 'url';

await initI18n();

store.dispatch('initApp').then(() => {

    const app = new Framework7({
        name: 'sinpefacil', // App name
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
                const linkShared = phone && name && price && detail;
                const bankId = await getOption(Keys.SELECTED_BANK);

                if (!bankId && linkShared) { // new user, no bank, we ask for it
                    app.dialog.confirm(
                        'Antes de enviar el SINPE, debe seleccionar su banco.',
                        'SINPE Fácil',
                        async () => { // ok
                            const banks = await db.banks.toArray();
                            const options = banks.map(bank => {
                                return { text: bank.name, onClick: () => handleSelect(bank.id, data) }
                            })

                            app.actions.create({
                                buttons: [
                                    options,
                                    [
                                        { text: 'Cancelar', color: 'red' }
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
                    generateSINPESMS(bank.phone, price, phone, name, detail);
                }

            }
        },

        // Register service worker (only on production build)
        serviceWorker: process.env.NODE_ENV === 'production' ? {
            path: 'service-worker.js',
        } : {},
    });

    // BACK BUTTON: This enables the back button on tabs
    app.on('tabShow', function (tabEl) {
        // adds entry to the history
        if (!window.history.state || window.history.state.tabId !== tabEl.id) {
            window.history.pushState({ tabId: tabEl.id }, '');
        }
    });

    // BACK BUTTON: change in history
    window.addEventListener('popstate', function (e) {
        console.log('pop', e.state, e.state.isInitial);

        if (e.state && e.state.tabId) {
            // load previous tab
            app.tab.show('#' + e.state.tabId, false);
        }
    });
});

/**
 * 
 * @param {Number} bankId 
 * @param {{price, phone, name, detail}} payload 
 */
async function handleSelect(bankId, { price, phone, name, detail }) {
    const bank = await db.banks.get(bankId);
    saveOption(Keys.SELECTED_BANK, bankId); // save bank for future links
    clearParams();
    generateSINPESMS(bank.phone, price, phone, name, detail);
}
