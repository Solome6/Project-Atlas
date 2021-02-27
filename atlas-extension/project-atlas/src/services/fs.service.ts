import * as fs from "fs";
import * as path from "path";
import * as vscode from "vscode";

export interface LogOptions {
    logError?: string;
}

export interface FSSelectOptions {
    title?: string;
}

export async function getFileContent(
    relativePath: string,
    { logError }: LogOptions = {},
): Promise<string> {
    return new Promise<string>((resolve, reject) => {
        fs.readFile(path.resolve(__dirname, "../", relativePath), (err, data) => {
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

export async function writeFile(
    relativePath: string,
    content: string,
    { logError }: LogOptions = {},
): Promise<void> {
    return new Promise<void>((resolve, reject) => {
        fs.writeFile(
            path.resolve(__dirname, "../", relativePath),
            content,
            { encoding: "utf8", flag: "w" },
            (err) => {
                if (err) {
                    vscode.window.showErrorMessage(
                        "Something went wrong. Try reinstalling Project Atlas",
                    );
                    logError && console.error(logError);
                    reject();
                }
                resolve();
            },
        );
    });
}

export async function selectFolder({ title }: FSSelectOptions = {}): Promise<
    vscode.Uri | undefined
> {
    return await vscode.window
        .showOpenDialog({
            canSelectFiles: false,
            canSelectFolders: true,
            canSelectMany: false,
            title,
            defaultUri: vscode.workspace.workspaceFolders?.[0].uri,
        })
        .then((uris) => uris?.[0]);
}
