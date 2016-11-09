import * as React from "react"
import Vector2 from "structures/vector2"

import "stylesheets/canvas"

export interface CanvasProps { layers: ArrayBuffer, position: Vector2 }

export class Canvas extends React.Component<CanvasProps, {}>{
    constructor() {
        super();
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
    }

    onPointerDown = (event: PointerEvent) => {
        console.log(event);
    }

    componentDidMount() {
        window.addEventListener("resize", this.onWindowResize);
        this.canvas.addEventListener("pointerdown", this.onPointerDown);
        this.canvas.addEventListener("click", this.onPointerDown);
    }

    componentWillUnmount() {
        window.removeEventListener("resize", this.onWindowResize);
        this.canvas.removeEventListener("pointerdown", this.onPointerDown);
        this.canvas.removeEventListener("click", this.onPointerDown);
    }


    render(): JSX.Element {
        return <canvas ref={this.initCanvas} />
    }
}