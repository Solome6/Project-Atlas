// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as svgjs from "@svgdotjs/svg.js";
import * as fs from "fs";
import * as path from "path";
// @ts-ignore
import { createSVGWindow } from "svgdom";
import * as vscode from "vscode";

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
        vscode.commands.registerCommand("project-atlas.openAtlas", () => {
            const panel = vscode.window.createWebviewPanel(
                "atlas",
                `${vscode.workspace.name ? `${vscode.workspace.name} ` : ""}Atlas`,
                vscode.ViewColumn.Beside,
                {
                    enableScripts: true,
                    retainContextWhenHidden: true,
                    enableFindWidget: true,
                },
            );

            // TODO: TEMPORARY
            fs.mkdirSync(path.resolve(__dirname, "./mocks"));
            fs.writeFileSync(path.resolve(__dirname, "./mocks/mock1.json"), generateRandomJSON());

            // TODO: TEMPORARY
            fs.readFile(path.resolve(__dirname, "./mocks/mock1.json"), (err, data) => {
                if (err) {
                    console.error(err);
                } else {
                    console.log(data.toString());
                    const jsonContents = JSON.parse(data.toString());
                    console.log(jsonContents);
                    panel.webview.html = geAtlasContent(jsonContents.data);
                }
            });
        }),
    );
}

function geAtlasContent(message: string): string {
    const window = createSVGWindow();
    const document = window.document;
    // @ts-ignore
    svgjs.registerWindow(window, document);

    const svgNode = document.documentElement;
    const svg = svgjs.SVG(svgNode) as svgjs.Svg;
    svg.size(500, 1000);

    // TODO: TEMPORARY
    // Create svg children
    svg.text(message)
        .move(20, 35)
        .font({
            family: "sans-serif",
            size: 30,
        })
        .fill("red");
    svg.rect(100, 100).move(250, 200).fill("#f06");

    const svgString = svg.svg();
    console.log(svgString);
    return svgString;
}

// TODO: TEMPORARY
function generateRandomJSON() {
    let result = '{"data":"';
    const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    const charactersLength = characters.length;
    const wordLength = 11 * Math.random();
    for (var i = 0; i < wordLength; i++) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result + '"}';
}

// this method is called when your extension is deactivated
export function deactivate() {}
