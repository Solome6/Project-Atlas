import { spawn } from "child_process";
import * as path from "path";

export interface ParseOptions {
    timeout?: number;
}

export function parseSourceToJSON(srcDir: string, { timeout }: ParseOptions = {}): Promise<string> {
    if (!srcDir) return Promise.reject("The given source directory is undefined");

    return new Promise((resolve, reject) => {
        let projectJSONString: string = "";

        const jarPath = path.resolve(__dirname, "../../atlas-java-parser.jar");
        const atlasProcess = spawn(`java`, [`-jar`, jarPath, `${srcDir}`], { timeout });

        atlasProcess.stderr.on("data", (data) => {
            reject(`There was an error parsing the source directory:\n${data}`);
        });

        atlasProcess.stdout.on("data", (data) => {
            projectJSONString += String(data);
        });

        atlasProcess.on("close", async (code: number) => {
            if (code === 0) {
                resolve(projectJSONString);
            } else {
                reject(`There was an error parsing the source directory. Code: ${code}`);
            }
        });
    });
}
