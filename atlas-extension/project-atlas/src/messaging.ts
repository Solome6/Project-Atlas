import * as vscode from "vscode";
import { APIMessageType, WebViewMessageType } from "./app/models/messages";
import { ExtensionState, WebviewPanel } from "./models/extension.models";
import { ConfirmationOption } from "./models/popup.models";
import { getFileContent, selectFolder, writeFile } from "./services/fs.service";
import { parseSourceToJSON } from "./services/parser.service";
import { getAtlasWebviewContent } from "./services/webview.service";

const CACHE_LOCATION: string = "atlas-for-project.json";

type WebViewMessageHandlerMap = {
    [type in WebViewMessageType]: (
        panel: WebviewPanel,
        extState: ExtensionState,
        data?: any,
    ) => void | Promise<void>;
};

export const webViewMessageHandlers = Object.freeze({
    [WebViewMessageType.AppLoaded]: handleAppLoad,
    [WebViewMessageType.Refresh]: handleAppRefresh,
    [WebViewMessageType.ChangeSource]: handleChangeSource,
    [WebViewMessageType.UnloadProject]: handleProjectUnload,
} as WebViewMessageHandlerMap);

async function handleAppLoad(panel: WebviewPanel, extState: ExtensionState) {
    try {
        // BUG: Need to initialize extState if cache present // TODO
        const projectJSONString: string = await getFileContent(CACHE_LOCATION);
        if (!projectJSONString) throw new Error("Cache is empty.");

        panel.webview.postMessage({
            type: APIMessageType.NewJSONData,
            data: JSON.parse(projectJSONString),
        });
    } catch {
        handleChangeSource(panel, extState);
    }
}

async function handleAppRefresh(panel: WebviewPanel, extState: ExtensionState) {
    panel.webview.html = "";
    panel.webview.html = await getAtlasWebviewContent(panel.webview, extState.context);
    parseSourceAndUpdateProject(panel, extState);
}

async function handleChangeSource(panel: WebviewPanel, extState: ExtensionState) {
    const newSrcDir = (await selectFolder({ title: "Select a Source Folder" }))?.fsPath;
    if (!newSrcDir || newSrcDir === extState.srcDir) return;

    extState.srcDir = newSrcDir;
    parseSourceAndUpdateProject(panel, extState);
}

async function handleProjectUnload(panel: WebviewPanel, extState: ExtensionState) {
    if (!extState.srcDir) {
        vscode.window.showInformationMessage("No project is currently loaded.");
        return;
    }

    vscode.window
        .showInformationMessage(
            "Are you sure you would like to unload the current project?",
            ConfirmationOption.Yes,
            ConfirmationOption.No,
        )
        .then((option) => {
            if (option !== ConfirmationOption.Yes) return;

            extState.srcDir = null;
            panel.webview.postMessage({
                type: APIMessageType.NewJSONData,
                data: null,
            });
        });
}

/**
 * Parses the current source directory and posts a message to update the project.
 */
async function parseSourceAndUpdateProject(
    panel: WebviewPanel,
    { srcDir = "" }: ExtensionState,
): Promise<void> {
    if (!srcDir) return;

    try {
        const projectJSONString = await parseSourceToJSON(srcDir);
        writeFile(CACHE_LOCATION, projectJSONString, {
            logError: "Can't write to cache",
        });

        panel.webview.postMessage({
            type: APIMessageType.NewJSONData,
            data: JSON.parse(projectJSONString),
        });
    } catch (error) {
        vscode.window.showErrorMessage(error);
    }
}
