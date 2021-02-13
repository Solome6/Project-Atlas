// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import { spawn } from "child_process";
import * as fs from "fs";
import * as path from "path";
import * as vscode from "vscode";
import { ArrowSVG, createArrow, createFileBox, FileBoxSVG } from "./atlasComponents";
import { Message, MessageType } from "./messaging";
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

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {
    // Use the console to output diagnostic information (console.log) and errors (console.error)
    // This line of code will only be executed once when your extension is activated
    console.log('Congratulations, your extension "project-atlas" is now active!');

    // The command has been defined in the package.json file
    // Now provide the implementation of the command with registerCommand
    // The commandId parameter must match the command field in package.json
    let disposable = vscode.commands.registerCommand("project-atlas.helloWorld", () => {
        // The code you place here will be executed every time your command is executed

        // Display a message box to the user
        vscode.window.showInformationMessage("Hello World from Project Atlas!");
        vscode.window.showErrorMessage("This is an error");
    });

    context.subscriptions.push(disposable);

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

            console.log("Starting process...");
            const srcDir = await vscode.window.showOpenDialog({  // src folder of the project to visualize
                canSelectFiles: false,
                canSelectFolders: true,
                title: "Source folder of the project."

            }).then((uri) => {
                if(uri !== undefined) {
                    return uri[0].fsPath;
                }
            });
            console.log("src " + srcDir);

            const atlasProcess = spawn(`java`, [`-jar`, `${path.resolve(__dirname, "../atlas-java-parser.jar")}`, `${srcDir}`]);
              
            atlasProcess.stderr.on('data', (data) => {
                console.error(`stderr: ${data}`);
              });

              let projectJSONString: string = "";
              atlasProcess.stdout.on('data', (data) => {
                  console.log(data.toString());
                  projectJSONString += data.toString();
              });

            //   console.log(projectJSONString);

            atlasProcess.on("close", async (code: number) => {
                console.log("Closing process...");
                if (code === 0) {
                    const projectJSON: ProjectJSON = JSON.parse(projectJSONString);
                    panel.webview.onDidReceiveMessage((message) =>
                        atlasMessageHandler(panel, message),
                    );
                    panel.webview.html = await getAtlasContent(projectJSON);
                } else {
                    console.log("Something went wrong, code:", code);
                }
            });

            panel.webview.onDidReceiveMessage((message) => atlasMessageHandler(panel, message));
            // panel.webview.html = await getAtlasContent({} as ProjectJSON);
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

async function atlasMessageHandler(panel: vscode.WebviewPanel, message: Message) {
    console.log("Message Recieved!");
    switch (message.type) {
        case MessageType.Refresh: {
            panel.webview.html = await getAtlasContent({} as ProjectJSON);
            // const atlasProcess = spawn("mvn", [
            //     "-f",
            //     "../../../atlas/pom.xml",
            //     "compile",
            //     "exec:java",
            //     '-Dexec.mainClass="atlas.App"',
            //     '-Dexec.args="path/of/root"',
            // ]);

            // atlasProcess.on("close", async (code) => {
            //     if (code === 0) {
            //         const projectJSONString = await getFileContent(
            //             "../../../atlas/atlas.json",
            //             "Project not found",
            //         );
            //         const projectJSON: ProjectJSON = JSON.parse(projectJSONString);
            //         panel.webview.html = await getAtlasContent(projectJSON);
            //     }
            // });
        }
    }
}

async function getAtlasContent(projectJSON: ProjectJSON) {
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
                --margin: 15px;
                top: var(--margin);
                right: var(--margin);

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
        <div class="ui" id="cameraIndicator">
            X: <span id="x-coord">0</span>
            Y: <span id="y-coord">0</span>
        </div>
        <svg id="globalSVG" width="100%" height="100%">
            <svg id="translateSVG">
                <g id="scaleGroup">
                    ${await generateContentSVG(projectJSON)}
                </g>
            </svg>
        </svg>
        <script>
            ${await getAtlasScripts()}
        </script>
    </body>
    </html>`;
}

async function getAtlasScripts() {
    return (await Promise.all([getMouseControls(), getUIControls()])).join("");
}
/**
 * Does not do anything yet because cannot find how to export css.
 */
async function getAtlasStyles() {
    return (await Promise.all([getSVGStyles()])).join("");
}

async function getMouseControls() {
    return await getFileContent("./scripts/mouseControls.js", "Cannot find mouse scripts");
}
async function getUIControls() {
    return await getFileContent("./scripts/uiControls.js", "Cannot find UI scripts");
}
async function getSVGStyles() {
    return await getFileContent("./svgStyles.css", "Cannot find SVG styles");
}

async function getFileContent(relativePath: string, logError?: string) {
    return await new Promise<string>((resolve, reject) => {
        fs.readFile(path.resolve(__dirname, relativePath), (err, data) => {
            if (err) {
                vscode.window.showErrorMessage(
                    "Something went wrong. Try reinstalling Project Atlas",
                );
                logError && console.error(logError);
                reject(err);
            } else {
                resolve(data.toString());
            }
        });
    });
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
