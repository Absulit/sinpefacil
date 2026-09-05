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
            about: `About`,
            updateAvailable: `Update available!\nIt will update next time you open the app.`,
            updateDownloadedTitle: `App Updated!`,
            updateDownloaded: `A new version of SINPE Fácil has been installed and is ready to use.`,
            version: `version`,
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

            charLengthValidation: `Exceedes the {{maxLength}} char limit ({{numChars}})`,
            smsExample: `SMS Example`,
            smsExampleContent: `PASE PRICE PHONE NAME DETAIL`,
            smsInfo: `160 characters max, 70 if there are special ones. Used: {{numChars}}.`,

            productCreatedConfirmation: `Product created`,
        },
        history: {
            explainer: `Select an item to see the detail.`,
            noHistory: `No history`,
            noHistoryExplainer: `Read a QR code or accept a payment link and it will show up here.`,

            CTADelete: `Do you want to delete '{{name}}'?`,
            deleteConfirmation: `Receipt deleted`,
        },
        settings: {
            phone: `Phone number`,
            phonePlaceholder: `Phone associated with SINPE Móvil`,
            bank: `Bank`,
            lang: `Force Language`,
            CTAselectBank: `You haven't selected your bank. Exit?`,
            phoneValidity: `Wrong phone number`,
        },
        share: {
            copyLink: `Copy Link`,
            saveImage: `Save Image`,
            copyConfirmation: `Link copied to clipboard`
        },
        code404: {
            title: `Not Found`,
            message: `Requested content not found.`
        },
        validation: {
            linkLength: `The link shared exceeds the number of characters allowed.\nAsk the sender to fix the link.`,
            linkLength: `The QR code exceeds the number of characters allowed.\nAsk the sender to fix the code.`,
        },
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
            about: `Acerca de`,
            updateAvailable: `¡Actualización disponible!\nSe actualizará la próxima vez que abra la aplicación.`,
            updateDownloadedTitle: `¡Aplicación Actualizada!`,
            updateDownloaded: `Una nueva versión de SINPE Fácil se ha instalado y está lista para usarse.`,
            version: `version`,
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
            explainer: `Seleccione un ítem de la lista para ver el código QR.`,
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

            charLengthValidation: `Excede el límite total de {{maxLength}} caracteres ({{numChars}})`,
            smsExample: `Ejemplo de SMS`,
            smsExampleContent: `PASE PRECIO TELÉFONO NOMBRE DETALLE`,
            smsInfo: `160 caracteres máximo, 70 si hay especiales. Usados: {{numChars}}.`,

            productCreatedConfirmation: `Producto creado`,
        },
        history: {
            explainer: `Seleccione un ítem para ver el detalle.`,
            noHistory: `No hay historial`,
            noHistoryExplainer: `Lea algún código QR o acepte un link de pago y le aparecerá luego aquí.`,

            CTADelete: `¿Desea borrar '{{name}}'?`,
            deleteConfirmation: `Recibo borrado`,            
        },
        settings: {
            phone: `Teléfono`,
            phonePlaceholder: `Teléfono asociado a SINPE Móvil`,
            bank: `Banco`,
            lang: `Forzar Idioma`,
            CTAselectBank: `No ha seleccionado su banco. ¿Salir?`,
            phoneValidity: `Número de teléfono incorrecto`,
        },
        share: {
            copyLink: `Copiar Link`,
            saveImage: `Guardar Imagen`,
            copyConfirmation: `Link copiado al portapapeles`
        },
        code404: {
            title: `No encontrado`,
            message: `No se encontró el contenido solicitado.`
        },
        validation: {
            linkLength: `El enlance compartido excede el número de caracteres permitidos.\n Solicite al emisor que corrija el enlace.`,
            QRLength: `El código QR leído excede el número de caracteres permitidos.\n Solicite al emisor que corrija el código.`,
        },
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

/**
 * Checks for a string that could have emojis, so then provide
 * the length of 1 emoji as 1 char instead of 
 * it's inner representation
 * @param {String} val 
 * @return {Number}
 */
export function strLen(val) {
    return [...new Intl.Segmenter(undefined, { granularity: 'grapheme' }).segment(val)].length;
}

export default i18next;
