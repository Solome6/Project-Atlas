import * as path from "path";
import * as vscode from "vscode";
import { APIMessage, APIMessageType, WebViewMessage, WebViewMessageType } from "./app/models/messages";
import { ConfirmationOption } from "./models/popup.models";
import { getFileContent, selectFolder, writeFile } from "./services/fs.service";
import { parseSourceToJSON } from "./services/parser.service";

interface Webview extends vscode.Webview {
    postMessage: (message: APIMessage) => Thenable<boolean>;
}

interface WebviewPanel extends vscode.WebviewPanel {
    webview: Webview;
}

/**
 * State related to the outer extension and not necessarily the Atlas app.
 */
interface ExtensionState {
    srcDir?: string | null;
}

const CACHE_LOCATION: string = "atlas-for-project.json";

/** Handler for when the extension is first activated */
export function activate(context: vscode.ExtensionContext) {
    console.log('Congratulations, your extension "project-atlas" is now active!');

    // State
    const extState: ExtensionState = {};

    context.subscriptions.push(
        vscode.commands.registerCommand("project-atlas.openAtlas", async () => {
            // setup panel
            const panel: WebviewPanel = vscode.window.createWebviewPanel(
                "atlas",
                `${vscode.workspace.name ? `${vscode.workspace.name} ` : ""}Atlas`,
                vscode.ViewColumn.Two,
                {
                    enableScripts: true,
                    retainContextWhenHidden: true,
                    enableFindWidget: true, // disable to work with iframes instead of webviews (vscode 1.56)
                },
            );

            panel.iconPath = getExtensionAssetURI("short_logo.png");
            panel.webview.html = await getAtlasWebviewContent(panel.webview);

            try {
                // BUG: Need to initialize extState if cache present // TODO
                const projectJSONString: string = await getFileContent(CACHE_LOCATION);
                if (!projectJSONString) throw new Error("Cache is empty.");

                panel.webview.postMessage({
                    type: APIMessageType.NewJSONData,
                    data: JSON.parse(projectJSONString),
                });
            } catch {
                extState.srcDir = (await selectFolder({ title: "Select a Source Folder" }))?.fsPath;
                parseSourceAndUpdateProject(panel, extState);
            }

            panel.webview.onDidReceiveMessage(createAtlasMessageHandler(panel, extState));
        }),
    );

    /**
     * Creates a message handler for the Atlas App webview to communicate with the extension.
     */
    function createAtlasMessageHandler(
        panel: vscode.WebviewPanel,
        extState: ExtensionState,
    ): (message: WebViewMessage) => void {
        return async (message: WebViewMessage) => {
            vscode.window.showInformationMessage(`Message Received! ${message.type}`); // TODO: TEMP

            switch (message.type) {
                case WebViewMessageType.ChangeSource: {
                    const newSrcDir = (await selectFolder({ title: "Select a Source Folder" }))?.fsPath;
                    if (!newSrcDir || newSrcDir === extState.srcDir) return;

                    extState.srcDir = newSrcDir;
                    parseSourceAndUpdateProject(panel, extState);
                    break;
                }
                case WebViewMessageType.Refresh: {
                    panel.webview.html = "";
                    panel.webview.html = await getAtlasWebviewContent(panel.webview);
                    parseSourceAndUpdateProject(panel, extState);
                    break;
                }
                case WebViewMessageType.UnloadProject: {
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
                    break;
                }
            }
        };
    }

    async function getAtlasWebviewContent(webview: vscode.Webview) {
        return `<html lang="en">
            <head>
                <script>
                    var vscode = acquireVsCodeApi();
                    var staticAssets = {
                        logo: "${getWebviewAssetURI(webview, "logo.png")}"
                    };
                </script>
                <script src="${getScriptURI("./app/app.js")}" async></script>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
            </head>
            <body>
                <div id="root"></div>
            </body>
        </html>`;
    }

    function getExtensionAssetURI(fileName: string): vscode.Uri {
        return vscode.Uri.file(path.join(context.extensionPath, "src", "assets", fileName));
    }

    function getWebviewAssetURI(webview: Webview, fileName: string): vscode.Uri {
        return webview.asWebviewUri(
            vscode.Uri.file(path.join(context.extensionPath, "src", "assets", fileName)),
        );
    }
}

/**
 * Parses the current source directory and posts a message to update the project.
 */
async function parseSourceAndUpdateProject(
    panel: vscode.WebviewPanel,
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

function getScriptURI(filePath: string): vscode.Uri {
    return vscode.Uri.file(path.join(__dirname, filePath)).with({
        scheme: "vscode-resource",
    });
}
