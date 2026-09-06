const tooltips = []
/**
 * One call per tooltip and to be called in a
 * `$onMounted`
 * @param {*} $f7 f7 app parameter
 * @param {HTMLElement} targetEl
 * @param {String} text tooltip text content
 */
export function createTooltip($f7, targetEl, text) {
    const tooltip = $f7.tooltip.create({
        targetEl,
        text,
        trigger: 'click',
    });
    tooltips.push(tooltip);
}

/**
 * One time call function and to be called in a
 * `$onBeforeUnmount`
 */
export function onUnmountDestroyTooltips() {
    tooltips.forEach(t => t.destroy());
}

/**
 *
 * @param {String} cssclass class to identify the tooltip.
 * This is required on createTooltip `targetEl` parameter
 * @returns
 */
export function tooltipIcon(cssclass) {
    return `<i style='font-size: 20px' class='${cssclass} icon f7-icons if-not-md'>info_circle_fill</i>
     <i style='font-size: 20px' class='${cssclass} icon material-icons if-md'>info</i>`;
}
