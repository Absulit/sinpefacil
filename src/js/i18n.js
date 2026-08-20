import i18next from 'i18next';

const resources = {
    en: {
        translation: {
            codes: "Codes",
            read: "Read",
            history: "History",
            capture: "capture",
        }
    },
    es: {
        translation: {
            codes: "Códigos",
            read: "Leer",
            history: "Historial",
            capture: "capturar",
        }
    }
};

export async function initI18n() {
    // TODO: save lang
    await i18next.init({
        lng: localStorage.getItem('app_lang') || navigator.language,
        fallbackLng: 'es',
        resources
    });
}

export default i18next;
