import i18next from 'i18next';
import { getOption, Keys } from 'db';

const resources = {
    en: {
        translation: {
            home: "Home",
            codes: "My QRs",
            read: "Read to Pay",
            history: "History",
            capture: "capture",
            settings: "Settings",
        }
    },
    es: {
        translation: {
            home: "Inicio",
            codes: "Mis QRs",
            read: "Leer y Pagar",
            history: "Historial",
            capture: "capturar",
            settings: "Ajustes",
        }
    }
};

export async function initI18n() {
    // TODO: save lang to enforce it via an option
    const lng = await getOption(Keys.LANG, navigator.language);
    
    await i18next.init({
        lng,
        fallbackLng: 'es-CR',
        resources
    });
}

export default i18next;
