import * as ReactDOM from "react-dom";
import { AtlasApp } from "./AtlasApp";
import "./index.css";
import { WebViewMessage } from "./models/messages";
import { ProjectJSON } from "./models/project";

interface VSCodeAPI {
    postMessage(message: WebViewMessage): void;
}
interface Settings {
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
        initialData: ProjectJSON;
        initialSettings: Settings;
        staticAssets: Assets;
    }
}

const loadApp = () => ReactDOM.render(<AtlasApp />, document.getElementById("root"));

if (document.readyState === "loading") {
    // Loading hasn't finished yet
    document.addEventListener("DOMContentLoaded", loadApp);
} else {
    // `DOMContentLoaded` has already fired
    loadApp();
}
