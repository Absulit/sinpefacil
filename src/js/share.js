import i18next from 'i18next';

export default function shareLink(app, text, url) {
    const shareData = {
        title: 'SINPE Fácil',
        text,
        url,
    };

    if (navigator.share) {
        navigator.share(shareData)
            .catch((err) => {
                // suppress errors caused by the user closing the share dialog
                if (err.name !== 'AbortError') console.error('Error al compartir:', err);
            });
    } else {
        app.actions.create({
            buttons: [
                [
                    {
                        text: i18next.t('share:copyLink'),
                        icon: '<i class="icon f7-icons if-not-md">square_on_square</i><i class="icon material-icons if-md">content_copy</i>',
                        onClick: () => {
                            navigator.clipboard.writeText(shareData.url);
                            app.toast.create({
                                text: i18next.t('share:copyConfirmation'),
                                closeTimeout: 2000,
                            }).open();
                        }
                    },
                    {
                        text: i18next.t('cancel'),
                        color: 'red',
                    }
                ]
            ]
        }).open();
    }
}


async function downloadImage(blob) {
    try {
        const blobUrl = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = blobUrl;
        link.download = 'qr.png';
        link.setAttribute('prevent-router', true)
        link.classList.add('external');

        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(blobUrl);
    } catch (err) {
        console.error('Error al descargar imagen:', err);
    }
}

export function shareImage(app, text, blob) {
    const shareData = {
        title: 'SINPE Fácil',
        text,
        files: [
            new File([blob], 'qr.png', { type: blob.type }),
        ],
    };

    /**
     * Navigator exists on Firefox mobile
     * but file share is not supported
     */
    const isFirefox = /Firefox|FxiOS/i.test(navigator.userAgent);

    if (navigator.share && !isFirefox) {
        navigator.share(shareData)
            .catch((err) => {
                // suppress errors caused by the user closing the share dialog
                if (err.name !== 'AbortError') console.error('Error al compartir:', err);
            });
    } else {

        app.actions.create({
            buttons: [
                [
                    {
                        text: i18next.t('share:saveImage'),
                        icon: '<i class="icon f7-icons if-not-md">square_on_square</i><i class="icon material-icons if-md">content_copy</i>',
                        onClick: () => downloadImage(blob)
                    },
                    {
                        text: i18next.t('cancel'),
                        color: 'red',
                    }
                ]
            ]
        }).open();

    }

}

/**
 * Encode url to hide phone
 * @param {Number} phone 
 * @param {String} name 
 * @param {Number} price 
 * @param {String} detail 
 * @returns 
 */
export function createURL(phone, name, price, detail) {
    return encodeURI(`${location.origin + location.pathname}?phone=${btoa(phone)}&name=${name}&price=${price}&detail=${detail}`);
}

// tests only
if (import.meta.env.DEV) {
    window.createURL = createURL;
}
