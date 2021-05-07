import * as path from "path";
import { ExtensionContext, Uri } from "vscode";
import { Webview } from "./models/extension.models";

export async function getAtlasWebviewContent(webview: Webview, context: ExtensionContext) {
    return `<html lang="en">
        <head>
            <script>
                var vscode = acquireVsCodeApi();
                var staticAssets = {
                    logo: "${getWebviewAssetURI(webview, context, "logo.png")}"
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

export function getExtensionAssetURI(context: ExtensionContext, fileName: string): Uri {
    return Uri.file(path.join(context.extensionPath, "src", "assets", fileName));
}

export function getWebviewAssetURI(webview: Webview, context: ExtensionContext, fileName: string): Uri {
    return webview.asWebviewUri(Uri.file(path.join(context.extensionPath, "src", "assets", fileName)));
}

export function getScriptURI(filePath: string): Uri {
    return Uri.file(path.join(__dirname, filePath)).with({
        scheme: "vscode-resource",
    });
}
