import * as React from 'react';
import { setPixel } from 'utils/pixels';
export interface PencilSetting { width: number }
export interface PencilProps {
    onUpdateImage: Function,
    onDraw: Function,
    image: ImageData,
    event: PaintEvent,
    settings: PencilSetting
}
interface PencilState { lastDrawPos: Vector2 }
export class Pencil extends React.PureComponent<PencilProps, PencilState>{
    constructor() {
        super()
        this.state = {
            lastDrawPos: null
        }
    }

    componentWillUpdate(nextProps: PencilProps, nextState: any) {
        let prevEvent = this.props.event;
        let nextEvent = nextProps.event;
        if (!nextEvent) {
            return;
        }
        if (this.state.lastDrawPos) {
            if (nextEvent.type === "paintmove") {
                if (nextEvent.pressure !== 0) {
                    this.draw(prevEvent, nextEvent);
                } else {
                    this.state.lastDrawPos = null;
                }
            }
            if (nextEvent.type === "paintup") {
                this.draw(prevEvent, nextEvent);
                this.state.lastDrawPos = null;
            }
        } else {
            if (nextEvent.type === "paintdown" || nextEvent.pressure !== 0) {
                this.draw(nextEvent, nextEvent);
            }
        }
        this.props.onDraw();
    }
    /**
     * draw line by circle with 25% spacing
     */
    draw(from: PaintEvent, to: PaintEvent) {
        let fromX = from.clientX;
        let fromY = from.clientY;
        let toX = to.clientX;
        let toY = to.clientY;
        if (this.state.lastDrawPos === null) {
            this.drawCircle(fromX, fromY);
            this.state.lastDrawPos = { x: fromX, y: fromY };
        }
        fromX = this.state.lastDrawPos.x;
        fromY = this.state.lastDrawPos.y;
        let dx = toX - fromX;
        let dy = toY - fromY;
        let date = Date.now();
        let distance = Math.sqrt(dx * dx + dy * dy);
        if (distance === 0) {
            return;
        }
        let radius = this.props.settings.width;
        if (radius === 0) {
            console.error('pen tool radius 0');
            return;
        }
        let dd = radius * 0.25;
        while (dd <= distance) {
            let x = fromX + dx * (dd / distance);
            let y = fromY + dy * (dd / distance);
            this.drawCircle(x, y);
            this.state.lastDrawPos = { x: x, y: y };
            dd += radius * 0.25;
        }
    }

    /**
     * Bresenham Line Draw algorithm
     * one pixel width
     * FROM: http://members.chello.at/~easyfilter/bresenham.html
     */
    drawBresenham(from: PaintEvent, to: PaintEvent) {
        let penWd = this.props.settings.width;
        let image = this.props.image;
        let width = image.width;
        let height = image.height;
        let fromX = from.clientX < width ? from.clientX : width;
        let fromY = from.clientY < height ? from.clientY : height;
        let toX = to.clientX < width ? to.clientX : width;
        let toY = to.clientY < height ? to.clientY : height;
        let dx = Math.abs(toX - fromX);
        let sx = fromX < toX ? 1 : -1;
        let dy = Math.abs(toY - fromY);
        let sy = fromY < toY ? 1 : -1;
        let err = dx - dy;
        let ed = dx + dy === 0 ? 1 : Math.sqrt(dx * dx + dy * dy);
        let color = { r: 0, g: 0, b: 0, a: 60 };
        for (let wd = (penWd + 1) / 2; ;) {
            let cc = Object.assign({}, color);
            if (err > ed) {
                console.error(err, ed);
            }
            cc.a = Math.max(0, cc.a * (1 - Math.abs((err - dx + dy) / ed)));
            setPixel(fromX, fromY, cc, image);
            let e2 = err, x2 = fromX;
            if (2 * e2 >= -dy) {
                let y2 = fromY;
                if (fromX === toX) {
                    break;
                }
                err -= dy, fromX += sx;
            }
            if (2 * e2 <= dx) {
                if (fromY === toY) {
                    break;
                }
                err += dx, fromY += sy;
            }
        }
    }

    /**
     * draw solid circle by center position
     */
    drawCircle(centerX: number, centerY: number) {
        let radius = this.props.settings.width;
        let image = this.props.image;
        let color = { r: 0, g: 0, b: 0, a: 20 };
        let left = centerX - Math.ceil(radius);
        let right = centerX + Math.ceil(radius);
        let top = centerY - Math.ceil(radius);
        let bottom = centerY + Math.ceil(radius);
        for (let y = top; y <= bottom; y++) {
            let inside = false;
            for (let x = left; x < centerX; x++) {
                if (inside) {
                    setPixel(x, y, color, image);
                    setPixel(2 * centerX - x, y, color, image);
                    continue;
                }
                let dx = centerX - x;
                let dy = centerY - y;
                let distance = Math.sqrt(dx * dx + dy * dy);
                let dd = distance - radius;
                if (dd < 0) {
                    setPixel(x, y, color, image);
                    setPixel(2 * centerX - x, y, color, image);
                    inside = true;
                } else {
                    if (dd >= 1) {
                        continue;
                    }
                    let cc = Object.assign({}, color);
                    cc.a = cc.a * (1 - dd);
                    setPixel(x, y, cc, image);
                    setPixel(2 * centerX - x, y, cc, image);
                }
            }
            let dy = Math.abs(y - centerY);
            let dd = dy - radius;
            if (dd < 0) {
                setPixel(centerX, y, color, image);
            } else {
                if (dd >= 1) {
                    continue;
                }
                let cc = Object.assign({}, color);
                cc.a = cc.a * (1 - dd);
                setPixel(centerX, y, cc, image);
            }
        }
    }

    render() {
        return <div />
    }
}