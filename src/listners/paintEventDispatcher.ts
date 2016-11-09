declare global {
    interface Window { paintEventDispatchers: Array<PaintEventDispatcher> }
    interface PointerEvent { originalEvent: Event }
}
window.paintEventDispatchers = window.paintEventDispatchers || [];

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
        event.stopImmediatePropagation();
        
        let ptDown = new PointerEvent("pointerdown", {
            pointerId:1,
            pointerType:"mouse",
            bubbles:false,
            cancelable:true,
            
        })
    }
}

class MouseUpDispatcher implements PaintEventDispatcher {
    eventName: string = "mouseup"
    eventListener: EventListener = function (event: MouseEvent) {
        event.stopImmediatePropagation();

    }
}