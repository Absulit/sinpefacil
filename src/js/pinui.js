import i18next from 'i18next';
import $$ from 'dom7';

const buttonsData = [
    { label: 1, value: 1 },
    { label: 2, value: 2 },
    { label: 3, value: 3 },
    { label: 4, value: 4 },
    { label: 5, value: 5 },
    { label: 6, value: 6 },
    { label: 7, value: 7 },
    { label: 8, value: 8 },
    { label: 9, value: 9 },
    { label: `<i class="icon if-not-md f7-icons">xmark_circle</i><i class="icon if-md material-icons">clear</i>`, value: 'C' },
    { label: 0, value: 0 },
    { label: `<i class="icon if-not-md f7-icons">delete_left</i><i class="icon if-md material-icons">backspace</i>`, value: 'Del' }
];

export function getPIN($f7) {
    return new Promise((resolve, reject) => {
        const maxChars = 4;

        let pin = '';

        const dialog = $f7.dialog.create({
            title: i18next.t('read:enterPIN'),
            content: `
        <div class="pin-display text-align-center">____</div>
        <div class="pin-numpad">
          ${buttonsData.map(b =>
                `<button type="button" class="button button-fill pin-btn" data-val="${b.value}">${b.label}</button>`
            ).join('')}
        </div>
      `,
            buttons: [
                {
                    text: i18next.t('cancel'),
                    role: 'cancel',
                    onClick: () => resolve(null)
                },
                {
                    text: i18next.t('OK'),
                    role: 'confirm',
                    close: false,
                    onClick: () => {
                        if (pin.length === maxChars) {
                            dialog.close();
                            resolve(pin);
                            return;
                        } else {
                            $f7.toast.show({ text: i18next.t('read:pinLengthError', { maxChars }), closeTimeout: 1500 });
                        }
                    }
                }
            ]
        }).open();

        // keypad buttons
        dialog.$el.find('.pin-btn').on('click', function () {
            const val = $$(this).dataset().val;

            navigator.vibrate?.(100)

            if (val === 'C') {
                pin = '';
            } else if (val === 'Del') {
                pin = pin.slice(0, -1);
            } else if (pin.length < maxChars) {
                pin += val;
            }

            // Update mask display (e.g., '•••___')
            // '•'.repeat(pin.length)
            const masked = pin + '_'.repeat(maxChars - pin.length);
            dialog.$el.find('.pin-display').text(masked);
        });
    });
}
