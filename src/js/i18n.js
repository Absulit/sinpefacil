// src/js/i18n.js
import i18next from 'i18next';

const resources = {
    en: {
        translation: {
            codes: "Codes",
            read: "Read",
            history: "History"
        }
    },
    es: {
        translation: {
            codes: "Códigos",
            read: "Leer",
            history: "Historial"
        }
    }
};

export async function initI18n() {
    await i18next.init({
        lng: localStorage.getItem('app_lang') || navigator.language,
        fallbackLng: 'es',
        resources
    });

    window.t = (key, params = {}) => i18next.t(key, params);
}

export default i18next;
