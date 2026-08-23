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
            credits: `Made in Costa Rica 🇨🇷 by`
        },
        home: {
            aboutContent: `This app generates QR codes (?) that allow other people pay you with SINPE MÓVIL. (?)

                    It also allows you to read QR codes from other people and send a SMS to pay them via SINPE MÓVIL.
            `,
            selectScreen: `Select what screen to load on start`,
            selectScreenContent: `Do you prefer to load the camera or your QR code list?
                    If you are a seller you will prefer My QRs, if you are a client you will prefer Read to Pay.
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
            credits: `Hecho en Costa Rica 🇨🇷 por`
        },
        home: {
            aboutContent: `Esta aplicación genera Códigos QR (?) para permitir a otras personas pagarte con SINPE MÓVIL. (?)

                    También te permite leer códigos QR de otras personas y enviar un SMS para pagarles via SINPE MÓVIL.
            `,
            selectScreen: `Seleccionar qué pantalla cargar al inicio`,
            selectScreenContent: `Prefiere que abra directamente a la cámara o prefiere cargar su lista de códigos QR?

                    Si ud es vendedor, preferirá Mis QRs, si es comprador preferirá Leer y Pagar.
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
