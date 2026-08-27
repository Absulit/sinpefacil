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
import { db, getOption, Keys } from 'db';

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

        on: {
            init: async () => {
                const urlParams = new URLSearchParams(window.location.search);
                const data = Object.fromEntries(urlParams.entries());
                const { phone, name, price, detail } = data;
                const linkShared = phone && name && price && detail;

                const bankId = await getOption(Keys.SELECTED_BANK);
                if (!bankId && linkShared) {
                    console.log('---- NEW USER, NO BANK, ASK');


                    app.dialog.confirm(
                        'Antes de leer un código QR, debe seleccionar su banco.',
                        'SINPE Fácil',
                        () => {
                            app.views.current.router.navigate(`/settings/?phone=${phone}&name=${name}&price=${price}&detail=${detail}`)
                            
                        },
                        () => {
                            // Reset flag if user cancels
                            const tabLink = document.querySelectorAll('.tab-link')[0]
                            app.tab.show(`#view-home`, tabLink, true);
                        }
                    );


                    return; // exit and SMS will be called after selecting bank
                }
                
                if(linkShared){
                    const bank = await db.banks.get(bankId);
                    generateSINPESMS(bank.phone, price, phone, name, detail);
                }

            }
        },

        // Register service worker (only on production build)
        serviceWorker: process.env.NODE_ENV === 'production' ? {
            path: 'service-worker.js',
        } : {},
    });

});

