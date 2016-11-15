declare global {
    interface PaintEvent extends Event {
        paintId: number
        paintType: string
        clientX: number
        clientY: number
        pressure: number
    }
}
export default function PaintEvent(inType: string, inDict: any): PaintEvent {
    let e: any;
    e = new Event(inType, inDict);
    e.paintId = inDict.paintId;
    e.paintType = inDict.paintType;
    e.clientX = inDict.clientX;
    e.clientY = inDict.clientY;
    e.pressure = inDict.pressure;
    return e;
}