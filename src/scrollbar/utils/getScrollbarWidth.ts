import css from './css';
let scrollbarWidth: number | undefined;

export default function getScrollbarWidth(): number {
    if (scrollbarWidth != undefined) return scrollbarWidth;
    /* istanbul ignore else */
    console.log(typeof document)
    if (typeof document !== 'undefined') {
        const div = document.createElement('div');
        css(div, {
            width: 100,
            height: 100,
            position: 'absolute',
            top: -9999,
            overflow: 'scroll',
            MsOverflowStyle: 'scrollbar'
        });
        document.body.appendChild(div);
        console.log(div.offsetWidth, div.clientWidth)
        scrollbarWidth = (div.offsetWidth - div.clientWidth);
        document.body.removeChild(div);
    } else {
        scrollbarWidth = 0;
    }
    return scrollbarWidth || 0;
}