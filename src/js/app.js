import $ from 'dom7';
import Framework7 from 'framework7/bundle';
import { Dexie } from 'dexie';


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

await initI18n();

var app = new Framework7({
    name: 'sinpefacil', // App name
    theme: 'auto', // Automatic theme detection
    darkMode: 'auto',

    el: '#app', // App root element
    component: App, // App main component
    store,
    routes,

    // Register service worker (only on production build)
    serviceWorker: process.env.NODE_ENV === 'production' ? {
        path: '/service-worker.js',
    } : {},
});