import * as React from "react";
import { Canvas } from "components/canvas"
import { Pencil } from "components/tools/pencil";
interface AppState { image: ImageData, event: PaintEvent, time: number, count: number }
export class App extends React.PureComponent<{}, AppState> {
    constructor() {
        super();
        this.state = { image: new ImageData(1000, 1000), event: null, time: Date.now(), count: 0 };
    }
    onPaintDown = (event: PaintEvent) => {
        console.log(event);
        this.setState({ event: event } as AppState);
    }
    onPaintUp = (event: PaintEvent) => {
        console.log(event);
        this.setState({ event: event } as AppState);
    }
    onPaintMove = (event: PaintEvent) => {
        this.setState({ event: event } as AppState);
    }
    onPaintLeave = (event: PaintEvent) => {
        this.setState({ event: event } as AppState);
    }
    
    onUpdateImage = (image: ImageData) => {

    }
    onDraw = () => {
        this.setState(function (prevState) {
            return { count: prevState.count + 1 } as AppState;
        })
    }
    render() {
        return <div>
            <Pencil onUpdateImage={this.onUpdateImage} image={this.state.image} event={this.state.event} onDraw={this.onDraw} />
            <Canvas image={this.state.image} position={{ x: 1, y: 2 }} onPaintDown={this.onPaintDown} onPaintUp={this.onPaintUp} onPaintMove={this.onPaintMove} count={this.state.count} />
        </div>;
    }
}
