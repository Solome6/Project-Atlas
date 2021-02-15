// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from "vscode";
import { ArrowSVG, createArrow, createFileBox, FileBoxSVG } from "./atlasComponents";
import { Message, MessageType } from "./messaging";
import { getFileContent, selectFolder, writeFile } from "./services/fs.service";
import { parseSourceToJSON } from "./services/parser.service";
import { convertToProject } from "./utilities";

export interface CodeBlock {
    path: string;
    lineStart: number;
    lineEnd: number;
    columnStart: number;
    columnEnd: number;
}

export interface FileBox {
    pathName: string;
    source: string;
    fileName: string;
}

export interface Arrow {
    from: CodeBlock;
    to: CodeBlock;
}

export interface ProjectJSON {
    fileBoxes: FileBox[];
    arrows: Arrow[];
}
export interface Project {
    fileBoxes: Map<string, FileBox>;
    arrows: Arrow[];
}

export interface Ref<T> {
    current?: T;
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
    const srcDirRef: Ref<string> = {};

    context.subscriptions.push(
        vscode.commands.registerCommand("project-atlas.openAtlas", async () => {
            const panel = vscode.window.createWebviewPanel(
                "atlas",
                `${vscode.workspace.name ? `${vscode.workspace.name} ` : ""}Atlas`,
                vscode.ViewColumn.Two,
                {
                    enableScripts: true,
                    retainContextWhenHidden: true,
                    enableFindWidget: true,
                },
            );

            let projectJSONString: string;
            try {
                // BUG: Need to initialize srcDir if cache present
                projectJSONString = await getFileContent(CACHE_LOCATION);
                if (projectJSONString) {
                    const projectJSON: ProjectJSON = JSON.parse(projectJSONString);
                    panel.webview.html = await getAtlasContent(projectJSON);
                } else {
                    throw new Error("Cache is empty.");
                }
            } catch {
                projectJSONString = "";
                srcDirRef.current = (
                    await selectFolder({ title: "Select a Source Folder" })
                )?.fsPath;

                parseSourceAndUpdatePanel(panel, srcDirRef);
            }

            panel.webview.onDidReceiveMessage(createAtlasMessageHandler(panel, srcDirRef));
        }),
    );
}

function getRootDir() {
    const dir = vscode.workspace.workspaceFolders;
    if (dir === undefined) {
        vscode.window.showErrorMessage("A workspace must be opened before running Project Atlas!");
    } else {
        return dir[0].uri.fsPath;
    }
}

/**
 * Parses the current source directory and updates the panels HTML string.
 */
async function parseSourceAndUpdatePanel(
    panel: vscode.WebviewPanel,
    srcDirRef: Ref<string>,
): Promise<void> {
    if (srcDirRef.current) {
        try {
            const projectJSONString = await parseSourceToJSON(srcDirRef.current);
            writeFile(CACHE_LOCATION, projectJSONString, {
                logError: "Can't write to cache",
            });

            const projectJSON: ProjectJSON = JSON.parse(projectJSONString);
            panel.webview.html = await getAtlasContent(projectJSON);
        } catch (error) {
            vscode.window.showErrorMessage(error);
        }
    }
}

function createAtlasMessageHandler(
    panel: vscode.WebviewPanel,
    srcDirRef: Ref<string>,
): (message: Message) => void {
    return async (message: Message) => {
        vscode.window.showInformationMessage("Message Received!");

        switch (message.type) {
            case MessageType.ChangeSource: {
                srcDirRef.current = (
                    await selectFolder({ title: "Select a Source Folder" })
                )?.fsPath;
                parseSourceAndUpdatePanel(panel, srcDirRef);
                break;
            }
            case MessageType.Refresh: {
                parseSourceAndUpdatePanel(panel, srcDirRef);
                break;
            }
        }
    };
}

async function getAtlasContent(projectJSON?: ProjectJSON) {
    return `<html>
    <head>
        <style>
            :root {
                --bgColor: var(--vscode-editor-background);
                --textColor: var(--vscode-editor-foreground);
                --textSelectionBgColor: var(--vscode-editor-selectionBackground);
                --textSelectionFgColor: var(--vscode-editor-selectionForeground);
            }

            html,
            body {
                width: 100%;
                height: 100%;
                background-color: var(--bgColor);
            }

            div.classBox {
                margin: 10px;
                overflow: scroll;
                display: block;
                width: 300px;
                height: 150px;
                border: 2px white solid;
                border-radius: 5px;
                transition: all 1s;
                box-sizing: content-box;
                box-sizing: border-box;
                background: skyblue;
                scrollbar-color: rgb(205, 205, 205);
            }

            foreignObject {
                position: relative;
                z-index: 0;
            }

            .scrollBoxBackground {
                position: relative;
                z-index: -1;
            }

            div.classBox:hover {
                border-width: 5px;
                transform: scale(1.05);
            }

            g.line rect.line-indicator {
                width: 100%;
                fill: rgb(131, 131, 142);
                transition: all 0.25s ease-in-out;
                position: relative;
                z-index: -1;
            }

            g.line {
                position: relative;
                z-index: 1;
            }

            g.line * {
                position: relative;
                z-index: 1;
            }

            g.line rect.line-number-background {
                fill: rgb(111, 111, 121);
                position: relative;
                z-index: 1;
            }

            g.line:hover rect.line-indicator {
                fill: rgb(150, 150, 163);
            }

            g.line text {
                fill: var(--textColor);
                z-index: 2;
            }

            svg {
                overflow: visible;
            }

            .ui {
                position: absolute;
                z-index: 100;
            }

            .arrow {
                position: relative;
                z-index: 10;
            }

            #refreshAtlasButton.ui {
                --margin-top: 15px;
                --margin-right: 15px;
            }

            #changeSourceButton.ui {
                --margin-top: calc(15px + 2rem + 10px);
                --margin-right: 15px;
            }

            #refreshAtlasButton.ui, #changeSourceButton.ui {
                top: var(--margin-top);
                right: var(--margin-right);

                font-family: 'Gill Sans', 'Gill Sans MT', Calibri, 'Trebuchet MS', sans-serif;
                font-size: 1.1rem;
                color: var(--textColor);

                background: var(--bgColor);
                background-image: linear-gradient(to bottom, transparent, rgb(0, 0, 0, 0.33));
                width: 10rem;
                height: 2rem;
                outline: white 1px solid;
            }

            #refreshAtlas.ui:hover {
                filter: brightness(1.15);
            }

            #refreshAtlas.ui:active {
                filter: brightness(0.87);
            }

            #cameraIndicator.ui {
                bottom: 0;
                right: 0;

                font-family: 'Gill Sans', 'Gill Sans MT', Calibri, 'Trebuchet MS', sans-serif;
                font-size: 0.75rem;
                color: var(--textSelectionFgColor);

                background: var(--textSelectionBgColor);
                display: flex;
                height: 1rem;
                padding: 0.25rem 0.5rem;
                border-radius: 0.25rem;
            }

            #cameraIndicator > * {
                margin: 0 4px 0 2px;
            }
        </style>
    </head>

    <body>
        <button class="ui" id="refreshAtlasButton">Refresh Atlas</button>
        <button class="ui" id="changeSourceButton">Change Source</button>
        <div class="ui" id="cameraIndicator">
            X: <span id="x-coord">0</span>
            Y: <span id="y-coord">0</span>
        </div>
        <svg id="globalSVG" width="100%" height="100%">
            <svg id="translateSVG">
                <g id="scaleGroup">
                    ${projectJSON ? await generateContentSVG(projectJSON) : ""}
                </g>
            </svg>
        </svg>
        <script>
            ${await getAtlasScripts()}
        </script>
    </body>
    </html>`;
}

async function getAtlasScripts(): Promise<string> {
    return (await Promise.all([getMouseControls(), getUIControls()])).join("");
}
/**
 * Does not do anything yet because cannot find how to export css.
 */
async function getAtlasStyles(): Promise<string> {
    return (await Promise.all([getSVGStyles()])).join("");
}

async function getMouseControls(): Promise<string> {
    return await getFileContent("./scripts/mouseControls.js", {
        logError: "Cannot find mouse scripts",
    });
}
async function getUIControls(): Promise<string> {
    return await getFileContent("./scripts/uiControls.js", { logError: "Cannot find UI scripts" });
}
async function getSVGStyles(): Promise<string> {
    return await getFileContent("./svgStyles.css", { logError: "Cannot find SVG styles" });
}

async function generateContentSVG(projectJson: ProjectJSON) {
    // TODO: TEMPORARY
    // projectJson = JSON.parse(await getFileContent("./mocks/mock1.json")) as ProjectJSON;

    const { fileBoxes, arrows }: Project = convertToProject(projectJson);
    const fileBoxesSVGMap: Map<string, FileBoxSVG> = new Map();

    let x = 10;
    let y = 10;
    fileBoxes.forEach((fileBox) => {
        fileBoxesSVGMap.set(
            fileBox.pathName,
            createFileBox({
                pathName: fileBox.pathName,
                location: { x, y },
                content: fileBox.source,
                shortName: fileBox.pathName.slice(fileBox.pathName.lastIndexOf(".")),
            }),
        );
        x += 700; // TODO: TEMPORARY
        y += 200; // TODO: TEMPORARY
    });

    const arrowsSVG: ArrowSVG[] = [];
    arrows.forEach((arrow) => {
        arrowsSVG.push(createArrow(arrow, fileBoxesSVGMap));
    });

    return [...fileBoxesSVGMap.values(), ...arrowsSVG].map((svg) => svg.svg()).join("");
}

// this method is called when your extension is deactivated
export function deactivate() {}
