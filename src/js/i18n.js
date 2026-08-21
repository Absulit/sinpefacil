import i18next from 'i18next';

const resources = {
    en: {
        translation: {
            home: "Home",
            codes: "My QRs",
            read: "Read to Pay",
            history: "History",
            capture: "capture",
        }
    },
    es: {
        translation: {
            home: "Inicio",
            codes: "Mis QRs",
            read: "Leer y Pagar",
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
