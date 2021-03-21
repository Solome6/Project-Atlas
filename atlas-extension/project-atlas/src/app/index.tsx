import * as ReactDOM from "react-dom";
import { AtlasApp } from "./AtlasApp";
import "./index.css";
import { WebViewMessage } from "./models/Messages";
import { ProjectJSON } from "./models/project";

interface VSCodeAPI {
    postMessage(message: WebViewMessage): void;
}
interface Settings {
    __TEST__: string;
}

interface Assets {
    [K: string]: string;
}

declare global {
    interface Window {
        acquireVsCodeApi(): VSCodeAPI;
        vscode: VSCodeAPI;
        initialData: ProjectJSON;
        settings: Settings;
        assets: Assets;
    }
}

ReactDOM.render(<AtlasApp />, document.getElementById("root"));
