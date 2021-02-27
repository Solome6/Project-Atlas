(() => {
    interface Message {
        type: string;
    }

    interface VSCodeAPI {
        postMessage(message: Message): void;
    }

    // @ts-ignore
    const vscode: VSCodeAPI = acquireVsCodeApi();
    document.getElementById("refreshAtlasButton")!.addEventListener("click", () => {
        vscode.postMessage({
            type: "refresh",
        });
    });

    document.getElementById("changeSourceButton")!.addEventListener("click", () => {
        vscode.postMessage({
            type: "change_source",
        });
    });
})();
