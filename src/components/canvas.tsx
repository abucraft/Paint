import * as React from "react"
import * as PEDispatcher from "listeners/paintEventDispatcher"
import "stylesheets/canvas"

export interface CanvasProps { image: ImageData, position: Vector2, onPaintDown: Function, onPaintUp: Function, onPaintMove: Function, count: number }
interface CanvasState { time: number }
export class Canvas extends React.PureComponent<CanvasProps, CanvasState>{
    constructor() {
        super();
        this.state = { time: Date.now() }
    }
    canvas: HTMLCanvasElement

    initCanvas = (canvas: HTMLCanvasElement) => {
        this.canvas = canvas;
        let height = window.innerHeight;
        let width = window.innerWidth;
        this.canvas.width = width;
        this.canvas.height = height;
    }

    onWindowResize = () => {
        let height = window.innerHeight;
        let width = window.innerWidth;
        this.canvas.width = width;
        this.canvas.height = height;
        this.draw();
    }

    onPaintDown = (event: PaintEvent) => {
        this.props.onPaintDown(event);
    }

    onPaintUp = (event: PaintEvent) => {
        this.props.onPaintUp(event);
    }

    onPaintMove = (event: PaintEvent) => {
        this.props.onPaintMove(event);
    }

    componentDidUpdate(prevProps: any, prevState: any) {
        this.draw();
        let now = Date.now();
        console.log(now - this.state.time);
        this.state.time=now;
    }

    componentDidMount() {
        window.addEventListener("resize", this.onWindowResize);
        PEDispatcher.watch(this.canvas);
        this.canvas.addEventListener('paintdown', this.onPaintDown);
        this.canvas.addEventListener('paintup', this.onPaintUp);
        this.canvas.addEventListener('paintmove', this.onPaintMove);
    }

    componentWillUnmount() {
        window.removeEventListener("resize", this.onWindowResize);
        PEDispatcher.unwatch(this.canvas);
        this.canvas.removeEventListener('paintdown', this.onPaintDown);
        this.canvas.removeEventListener('paintup', this.onPaintUp);
        this.canvas.removeEventListener('paintmove', this.onPaintMove);
    }

    draw() {
        let context = this.canvas.getContext('2d');
        context.putImageData(this.props.image, 0, 0);
    }
    render(): JSX.Element {
        return <canvas ref={this.initCanvas} />
    }
}