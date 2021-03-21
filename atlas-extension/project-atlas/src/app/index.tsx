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

// function Test() {
//     const countRef = React.useRef(0);
//     const [count, setCount] = React.useState(countRef.current);

//     React.useEffect(() => {
//         let timer = setInterval(() => {
//             setCount(++countRef.current);
//         }, 1000);

//         console.log(vscode);

//         return () => {
//             clearInterval(timer);
//         };
//     }, [countRef]);

//     return (
//         <div>
//             <div>Hello. This is rendered with React.</div>
//             <div>
//                 State updates with react: {count} rerender{count !== 1 ? "s" : ""}
//             </div>
//         </div>
//     );
// }
