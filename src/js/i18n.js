import i18next from 'i18next';
import { getOption, Keys } from 'db';

const resources = {
    en: {
        translation: {
            home: "Home",
            codes: "My QRs",
            read: "Read to Pay",
            history: "History",
            settings: "Settings",
        },
        home: {
            about: `This app generates QR codes (?) that allow other people pay you with SINPE MÓVIL. (?)

                    It also allows you to read QR codes from other people and send a SMS to pay them via SINPE MÓVIL.
            `,
        },
        read: {
            capture: "capture",
        }
    },
    es: {
        translation: {
            home: "Inicio",
            codes: "Mis QRs",
            read: "Leer y Pagar",
            history: "Historial",
            settings: "Ajustes",
        },
        home: {
            about: `Esta aplicación genera Códigos QR (?) para permitir a otras personas pagarte con SINPE MÓVIL. (?)

                    También te permite leer códigos QR de otras personas y enviar un SMS para pagarles via SINPE MÓVIL.
            `,
        },
        read: {
            capture: "capturar",
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
