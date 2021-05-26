import * as vscode from "vscode";
import { WebViewMessage } from "./app/models/messages";
import { webViewMessageHandlers } from "./messaging";
import { ExtensionState, WebviewPanel } from "./models/extension.models";
import { getAtlasWebviewContent, getExtensionAssetURI } from "./services/webview.service";

/** Handler for when the extension is first activated */
export function activate(context: vscode.ExtensionContext) {
    console.log('Congratulations, your extension "project-atlas" is now active!');

    // State
    const extState: ExtensionState = { context };

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

            panel.iconPath = getExtensionAssetURI(context, "short_logo.png");
            panel.webview.html = await getAtlasWebviewContent(panel.webview, context);
            panel.webview.onDidReceiveMessage(async ({ type, data }: WebViewMessage) =>
                webViewMessageHandlers[type](panel, extState, data),
            );
        }),
    );
}
