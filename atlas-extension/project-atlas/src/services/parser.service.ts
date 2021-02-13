import { spawn } from "child_process";
import * as path from "path";

export interface ParseOptions {
    timeout?: number;
}

export function parseSourceToJSON(srcDir: string, { timeout }: ParseOptions = {}): Promise<string> {
    return new Promise((resolve, reject) => {
        let projectJSONString: string = "";

        const atlasProcess = spawn(
            `java`,
            [`-jar`, `${path.resolve(__dirname, "../atlas-java-parser.jar")}`, `${srcDir}`],
            { timeout },
        );

        atlasProcess.stderr.on("data", (data) => {
            reject(`stderr: ${data}`);
        });

        atlasProcess.stdout.on("data", (data) => {
            projectJSONString += data.toString();
        });

        atlasProcess.on("close", async (code: number) => {
            if (code === 0) {
                resolve(projectJSONString);
            } else {
                const errorMsg = `Something went wrong, code: ${code}`;
                reject(errorMsg);
            }
        });
    });
}
