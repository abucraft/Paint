import * as React from 'react';
export interface PencilProps { onUpdateImage: Function, onDraw: Function, image: ImageData, event: PaintEvent }
interface PencilState { down: boolean }
export class Pencil extends React.PureComponent<PencilProps, PencilState>{
    constructor() {
        super()
        this.state = {
            down: false
        }
    }
    componentWillUpdate(nextProps: PencilProps, nextState: any) {
        let prevEvent = this.props.event;
        let nextEvent = nextProps.event;
        if (!nextEvent) {
            return;
        }
        //this.drawPoint(nextEvent);
        if (this.state.down) {
            if (nextEvent.type === "paintmove") {
                if (nextEvent.pressure !== 0) {
                    this.draw(prevEvent, nextEvent);
                } else {
                    this.state.down = false;
                }
            }
            if (nextEvent.type === "paintup") {
                this.draw(prevEvent, nextEvent);
                this.state.down = false;
            }
        } else {
            if (nextEvent.type === "paintdown" || nextEvent.pressure !== 0) {
                this.state.down = true;
            }
        }
        this.props.onDraw();
    }
    draw(from: PaintEvent, to: PaintEvent) {
        let image = this.props.image;
        let width = image.width;
        let height = image.height;
        let fromX = from.clientX < width ? from.clientX : width;
        let fromY = from.clientY < height ? from.clientY : height;
        let toX = to.clientX < width ? to.clientX : width;
        let toY = to.clientY < height ? to.clientY : height;
        let dx = Math.abs(toX - fromX);
        let sx = fromX < toX ? 1 : -1;
        let dy = -Math.abs(toY - fromY);
        let sy = fromY < toY ? 1 : -1;
        let err = dx + dy;
        let e2: number;
        let data = image.data;
        while (fromX !== toX || fromY !== toY) {
            data[(fromY * width + fromX) * 4] = 0;
            data[(fromY * width + fromX) * 4 + 1] = 0;
            data[(fromY * width + fromX) * 4 + 2] = 0;
            data[(fromY * width + fromX) * 4 + 3] = 255;
            e2 = 2 * err;
            if (e2 >= dy) {
                err += dy;
                fromX += sx;
            }
            if (e2 <= dx) {
                err += dx;
                fromY += sy;
            }
        }
    }

    drawPoint(event: PaintEvent) {
        let image = this.props.image;
        let width = image.width;
        let height = image.height;
        if (event.clientX >= image.width || event.clientY >= image.height) {
            return;
        }
        image.data[(event.clientY * width + event.clientX) * 4] = 0;
        image.data[(event.clientY * width + event.clientX) * 4 + 1] = 0;
        image.data[(event.clientY * width + event.clientX) * 4 + 2] = 0;
        image.data[(event.clientY * width + event.clientX) * 4 + 3] = 255;
    }
    render() {
        return <div />
    }
}