import * as React from "react";
import * as ReactDOM from "react-dom";
import { AppContainer } from "react-hot-loader";
import { App } from "./app";

ReactDOM.render(
    <AppContainer>
        <App compiler="TypeScript" framework="React" />
    </AppContainer>,
    document.getElementById("example")
);

// Hot Module Replacement API
if (module.hot) {
  module.hot.accept();
}