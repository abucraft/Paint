import * as React from "react";
import Vector2 from "structures/vector2"
import { Canvas } from "components/canvas"
import 'stylesheets/hello';

export interface AppProps { compiler: string; framework: string; }

export class App extends React.Component<AppProps, {}> {
    render() {
        return <div>
                <h1>Hello from {this.props.compiler}and {this.props.framework}!</h1>
                <Canvas layers={new ArrayBuffer(100)} position={new Vector2(1, 2)} />
            </div>;
    }
}
