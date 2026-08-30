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
