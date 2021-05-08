import * as ReactDOM from "react-dom";
import { AtlasApp } from "./AtlasApp";
import "./index.css";
import { WebViewMessage, WebViewMessageType } from "./models/messages";

interface VSCodeAPI {
    postMessage(message: WebViewMessage): void;
}
interface Settings {
    // TODO: TEMP
    __TEST__: string;
    gridEnabled: boolean;
}

interface Assets {
    [K: string]: string;
}

declare global {
    interface Window {
        acquireVsCodeApi(): VSCodeAPI;
        vscode: VSCodeAPI;
        initialSettings: Settings;
        staticAssets: Assets;
    }
}

const loadApp = () => {
    ReactDOM.render(<AtlasApp />, document.getElementById("root"));
    window.vscode.postMessage({ type: WebViewMessageType.AppLoaded });
};

if (document.readyState === "loading") {
    // Loading hasn't finished yet
    document.addEventListener("DOMContentLoaded", loadApp);
} else {
    // `DOMContentLoaded` has already fired
    loadApp();
}
