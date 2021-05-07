import * as vscode from "vscode";
import { APIMessage } from "../app/models/messages";

export interface Webview extends vscode.Webview {
    postMessage: (message: APIMessage) => Thenable<boolean>;
}

export interface WebviewPanel extends vscode.WebviewPanel {
    webview: Webview;
}

/**
 * State related to the outer extension and not necessarily the Atlas app.
 */
export interface ExtensionState {
    context: vscode.ExtensionContext;
    srcDir?: string | null;
}
