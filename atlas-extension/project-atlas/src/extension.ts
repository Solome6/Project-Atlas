// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as path from "path";
import { createRef, MutableRefObject } from "react";
import * as vscode from "vscode";
import { APIMessage, APIMessageType, WebViewMessage, WebViewMessageType } from "./app/models/messages";
import { ProjectJSON } from "./app/models/project";
import { getFileContent, selectFolder, writeFile } from "./services/fs.service";
import { parseSourceToJSON } from "./services/parser.service";

interface Webview extends vscode.Webview {
    postMessage: (message: APIMessage) => Thenable<boolean>;
}

interface WebviewPanel extends vscode.WebviewPanel {
    webview: Webview;
}

const ATLAS_METADATA_LOCATION: string = "atlas-metadata.json";
const CACHE_LOCATION: string = "atlas-for-project.json";

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {
    console.log('Congratulations, your extension "project-atlas" is now active!');

    // Test command
    let disposable = vscode.commands.registerCommand("project-atlas.helloWorld", () => {
        vscode.window.showInformationMessage("Hello World from Project Atlas!");
    });
    context.subscriptions.push(disposable);

    // constants
    const srcDirRef = createRef() as MutableRefObject<string | undefined>;

    context.subscriptions.push(
        vscode.commands.registerCommand("project-atlas.openAtlas", async () => {
            const panel: WebviewPanel = vscode.window.createWebviewPanel(
                "atlas",
                `${vscode.workspace.name ? `${vscode.workspace.name} ` : ""}Atlas`,
                vscode.ViewColumn.Two,
                {
                    enableScripts: true,
                    retainContextWhenHidden: true,
                    enableFindWidget: true,
                },
            );
            panel.iconPath = getExtensionAssetURI("short_logo.png");

            let projectJSONString: string;
            try {
                // BUG: Need to initialize srcDir if cache present
                projectJSONString = await getFileContent(CACHE_LOCATION);
                if (projectJSONString) {
                    const projectJSON: ProjectJSON = JSON.parse(projectJSONString);
                    panel.webview.html = await getAtlasWebviewContent(panel.webview, projectJSON);
                } else {
                    throw new Error("Cache is empty.");
                }
            } catch {
                projectJSONString = "";
                srcDirRef.current = (await selectFolder({ title: "Select a Source Folder" }))?.fsPath;

                parseSourceAndUpdatePanel(panel, srcDirRef);
            }

            panel.webview.postMessage({
                type: APIMessageType.NewJSONData,
                data: JSON.parse(projectJSONString),
            });
            panel.webview.onDidReceiveMessage(createAtlasMessageHandler(panel, srcDirRef));
        }),
    );

    /**
     * Parses the current source directory and updates the panels HTML string.
     */
    async function parseSourceAndUpdatePanel(
        panel: vscode.WebviewPanel,
        srcDirRef: MutableRefObject<string | undefined>,
    ): Promise<void> {
        if (srcDirRef.current) {
            try {
                const projectJSONString = await parseSourceToJSON(srcDirRef.current);
                writeFile(CACHE_LOCATION, projectJSONString, {
                    logError: "Can't write to cache",
                });

                const projectJSON: ProjectJSON = JSON.parse(projectJSONString);
                panel.webview.html = await getAtlasWebviewContent(panel.webview, projectJSON);
            } catch (error) {
                vscode.window.showErrorMessage(error);
            }
        }
    }

    function createAtlasMessageHandler(
        panel: vscode.WebviewPanel,
        srcDirRef: MutableRefObject<string | undefined>,
    ): (message: WebViewMessage) => void {
        return async (message: WebViewMessage) => {
            vscode.window.showInformationMessage("Message Received!");

            switch (message.type) {
                case WebViewMessageType.ChangeSource: {
                    srcDirRef.current = (await selectFolder({ title: "Select a Source Folder" }))?.fsPath;
                    parseSourceAndUpdatePanel(panel, srcDirRef);
                    break;
                }
                case WebViewMessageType.Refresh: {
                    parseSourceAndUpdatePanel(panel, srcDirRef);
                    break;
                }
            }
        };
    }

    async function getAtlasWebviewContent(webview: vscode.Webview, projectJSON?: ProjectJSON) {
        return `<html lang="en">
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <script>
                    var vscode = acquireVsCodeApi();
                    var staticAssets = {
                        logo: "${getWebviewAssetURI(webview, "logo.png")}"
                    };
                </script>
                <script src="${getScriptURI("./app/app.js")}" defer></script>
            </head>
            <body>
                <div id="root"></div>
            </body>
        </html>`;
    }

    function getScriptURI(filePath: string): vscode.Uri {
        return vscode.Uri.file(path.join(__dirname, filePath)).with({
            scheme: "vscode-resource",
        });
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

// async function generateContentSVG(projectJson: ProjectJSON) {
//     // TODO: TEMPORARY
//     // projectJson = JSON.parse(await getFileContent("./mocks/mock1.json")) as ProjectJSON;

//     const { fileBoxes, arrows }: Project = convertToProject(projectJson);
//     const fileBoxesSVGMap: Map<string, FileBoxSVG> = new Map();

//     let x = 10;
//     let y = 10;
//     fileBoxes.forEach((fileBox) => {
//         fileBoxesSVGMap.set(
//             fileBox.pathName,
//             createFileBox({
//                 pathName: fileBox.pathName,
//                 location: { x, y },
//                 content: fileBox.source,
//                 shortName: fileBox.pathName.slice(fileBox.pathName.lastIndexOf(".")),
//             }),
//         );
//         x += 700; // TODO: TEMPORARY
//         y += 200; // TODO: TEMPORARY
//     });

//     const arrowsSVG: ArrowSVG[] = [];
//     arrows.forEach((arrow) => {
//         arrowsSVG.push(createArrow(arrow, fileBoxesSVGMap));
//     });

//     return [...fileBoxesSVGMap.values(), ...arrowsSVG].map((svg) => svg.svg()).join("");
// }

// // this method is called when your extension is deactivated
// export function deactivate() {}
