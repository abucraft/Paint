declare global {
    interface Window { paintEventDispatchers: Array<PaintEventDispatcher> }
}
window.paintEventDispatchers = window.paintEventDispatchers || [];

import CreatePaintEvent from 'listeners/paintEvent';

export interface PaintEventDispatcher { eventName: string, eventListener: EventListener }

export function watch(element: HTMLElement) {
    window.paintEventDispatchers.forEach((dispatcher: PaintEventDispatcher) => {
        element.addEventListener(dispatcher.eventName, dispatcher.eventListener);
    });
}

export function unwatch(element: HTMLElement) {
    window.paintEventDispatchers.forEach((dispatcher) => {
        element.removeEventListener(dispatcher.eventName, dispatcher.eventListener);
    })
}

class MouseDownDispatcher implements PaintEventDispatcher {
    eventName: string = "mousedown"
    eventListener: EventListener = function (event: MouseEvent) {
        if (event.button !== 0) {
            return;
        }
        let ptDown = CreatePaintEvent("paintdown", {
            paintId: 1,
            paintType: "mouse",
            bubbles: false,
            cancelable: true,
            clientX: event.clientX,
            clientY: event.clientY,
            pressure: 1,
        })
        event.target.dispatchEvent(ptDown);
    }
}

class MouseUpDispatcher implements PaintEventDispatcher {
    eventName: string = "mouseup"
    eventListener: EventListener = function (event: MouseEvent) {
        if (event.button !== 0) {
            return;
        }
        let ptUp = CreatePaintEvent("paintup", {
            paintId: 1,
            paintType: "mouse",
            bubbles: false,
            cancelable: true,
            clientX: event.clientX,
            clientY: event.clientY,
            pressure: 0,
        })
        event.target.dispatchEvent(ptUp);
    }
}

class MouseMoveDispatcher implements PaintEventDispatcher {
    eventName: string = "mousemove"
    eventListener: EventListener = function (event: MouseEvent) {
        if (event.button !== 0) {
            return;
        }
        let ptMove = CreatePaintEvent("paintmove", {
            paintId: 1,
            paintType: "mouse",
            bubbles: false,
            cancelable: true,
            clientX: event.clientX,
            clientY: event.clientY,
            pressure: event.buttons ? 1 : 0,
        })
        event.target.dispatchEvent(ptMove);
    }
}
window.paintEventDispatchers.push(new MouseDownDispatcher(), new MouseUpDispatcher(), new MouseMoveDispatcher());