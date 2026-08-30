import i18next from 'i18next';
import { getOption, Keys } from 'db';

// Spanish, English, German, French, Dutch

const resources = {
    en: {
        translation: {
            home: "Home",
            codes: "My QRs",
            read: "Read to Pay",
            history: "History",
            settings: "Settings",
            credits: `Made in Costa Rica 🇨🇷 by`,
            delete: `Delete`,
            print: `Print`,
            cancel: `Cancel`,
        },
        home: {
            aboutContent: `This app generates QR codes (?) that allow other people pay you with SINPE MÓVIL. (?)

                    It also allows you to read QR codes from other people and send a SMS to pay them via SINPE MÓVIL.
            `,
            selectScreen: `Select what screen to load on start`,
            selectScreenContent: `Do you prefer to load the camera or your QR code list?
                    If you are a seller you will prefer My QRs, if you are a client you will prefer Read to Pay.
            `,
            mainScreen: `Main Screen`,
        },
        read: {
            CTASelectBank: `Before reading a QR code, you must select your bank.`,
            CTASendSMS: `Send SMS to {{bank}}?`,
            CTASendSMSTitle: `QR Code read`,
        },
        codes: {
            explainer: `Select an item from the list to see the QR code.`,
            noCodes: `No products`,
            noCodesExplainer: `Add here a QR code per product you want to sell, e.g: Popcorn for 1000 colones.`,
            addNew: `Add New QR Code`,

            editTitle: `Edit QR / Product`,
            addTitle: `Create QR / Product`,
            phone: `Phone number`,
            phonePlaceholder: `New number or create one in Settings`,
            name: `Name`,
            namePlaceholder: `Product to sell`,
            price: `Price`,
            pricePlaceholder: `₡0.00`,
            detail: `Detail`,
            detailPlaceholder: `Description`,
            submitButtonEdit: `Update`,
            submitButtonAdd: `Create`,

            CTADelete: `Do you want to delete '{{name}}'?`,
            deleteConfirmation: `Code deleted`,
        },
        history: {
            explainer: `Select an item to see the detail.`,
            noHistory: `No history`,
            noHistoryExplainer: `Read a QR code or accept a payment link and it will show up here.`,
        },
        settings: {
            phone: `Phone number`,
            phonePlaceholder: `Phone associated with SINPE Móvil`,
            bank: `Bank`,
            lang: `Force Language`,
        },
        share: {
            copyLink: `Copy Link`,
            copyConfirmation: `Link copied to clipboard`
        }
    },
    es: {
        translation: {
            home: "Inicio",
            codes: "Mis QRs",
            read: "Leer y Pagar",
            history: "Historial",
            settings: "Ajustes",
            credits: `Hecho en Costa Rica 🇨🇷 por`,
            delete: `Borrar`,
            print: `Imprimir`,
            cancel: `Cancelar`,
        },
        home: {
            aboutContent: `Esta aplicación genera Códigos QR (?) para permitir a otras personas pagarte con SINPE MÓVIL. (?)

                    También te permite leer códigos QR de otras personas y enviar un SMS para pagarles via SINPE MÓVIL.
            `,
            selectScreen: `Seleccionar qué pantalla cargar al inicio`,
            selectScreenContent: `Prefiere que abra directamente a la cámara o prefiere cargar su lista de códigos QR?

                    Si ud es vendedor, preferirá Mis QRs, si es comprador preferirá Leer y Pagar.
            `,
            mainScreen: `Pantalla Principal`,
        },
        read: {
            CTASelectBank: `Antes de leer un código QR, debe seleccionar su banco.`,
            CTASendSMS: `¿Enviar SMS a {{bank}}?`,
            CTASendSMSTitle: `Código QR leído`,
        },
        codes: {
            explainer: `Seleccione un item de la lista para ver el código QR.`,
            noCodes: `No hay productos`,
            noCodesExplainer: `Agregue aquí un código QR por cada producto que quiera vender, por ejemplo:
            Palomitas a mil colones.`,
            addNew: `Agregar Nuevo`,

            editTitle: `Editar QR / Producto`,
            addTitle: `Crear QR / Producto`,
            phone: `Teléfono`,
            phonePlaceholder: `Nuevo número o cree uno en Ajustes`,
            name: `Nombre`,
            namePlaceholder: `Producto a vender`,
            price: `Precio`,
            pricePlaceholder: `₡0.00`,
            detail: `Detalle`,
            detailPlaceholder: `Una descripción`,
            submitButtonEdit: `Actualizar`,
            submitButtonAdd: `Crear`,

            CTADelete: `¿Desea borrar '{{name}}'?`,
            deleteConfirmation: `Código borrado`,
        },
        history: {
            explainer: `Seleccione un item para ver el detalle.`,
            noHistory: `No hay historial`,
            noHistoryExplainer: `Lea algún código QR o acepte un link de pago y le aparecerá luego aquí.`,
        },
        settings: {
            phone: `Teléfono`,
            phonePlaceholder: `Teléfono asociado a SINPE Móvil`,
            bank: `Banco`,
            lang: `Forzar Idioma`,
        },
        share: {
            copyLink: `Copiar Link`,
            copyConfirmation: `Link copiado al portapapeles`
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

export function formatDate(date) {
    return new Intl.DateTimeFormat(i18next.language, {
        dateStyle: 'medium',
        timeStyle: 'short'
    }).format(date);
}

export default i18next;
