"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const vscode = require("vscode");
const cp = require("child_process");
const isWsl = require("is-wsl");
class HtmlBeautifier {
    /**
     * Formats the given data using HTML Beautifier
     * @param {string} data - The data to be formatted
     * @returns {Promise<string>} The formatted data
     */
    format(data) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const cmd = `${this.exe} ${this.cliOptions.join(" ")} with custom env ${JSON.stringify(this.customEnvVars)}`;
                console.log(`Formatting ERB with command: ${cmd}`);
                console.time(cmd);
                const result = yield this.executeCommand(cmd, data);
                console.timeEnd(cmd);
                return result;
            }
            catch (error) {
                console.error(error);
                const errorMessage = error instanceof Error ? error.message : "Unknown error occurred";
                vscode.window.showErrorMessage(`Error occurred while formatting: ${errorMessage}`);
                throw error;
            }
        });
    }
    executeCommand(cmd, data) {
        return new Promise((resolve, reject) => {
            const htmlbeautifier = cp.spawn(this.exe, this.cliOptions, {
                cwd: vscode.workspace.rootPath || __dirname,
                env: Object.assign(Object.assign({}, process.env), this.customEnvVars),
            });
            if (htmlbeautifier.stdin === null || htmlbeautifier.stdout === null) {
                const msg = "Couldn't initialize STDIN or STDOUT";
                console.warn(msg);
                vscode.window.showErrorMessage(msg);
                reject(new Error(msg));
                return;
            }
            let result = "";
            let errorMessage = "";
            htmlbeautifier.on("error", (err) => {
                console.warn(err);
                vscode.window.showErrorMessage(`Couldn't run ${this.exe} '${err.message}'`);
                reject(err);
            });
            htmlbeautifier.stdout.on("data", (data) => {
                result += data.toString();
            });
            htmlbeautifier.stderr.on("data", (data) => {
                errorMessage += data.toString();
            });
            htmlbeautifier.on("exit", (code) => {
                if (code) {
                    vscode.window.showErrorMessage(`Failed with exit code: ${code}. '${errorMessage}'`);
                    reject(new Error(`Command failed with exit code ${code}`));
                }
                else {
                    resolve(result);
                }
            });
            htmlbeautifier.stdin.write(data);
            htmlbeautifier.stdin.end();
        });
    }
    /**
     * Returns the executable path for HTML Beautifier
     * @returns {string} The executable path
     */
    get exe() {
        const config = vscode.workspace.getConfiguration("vscode-erb-beautify");
        const executePath = config.get("executePath", "htmlbeautifier");
        const useBundler = config.get("useBundler", false);
        const bundlerPath = config.get("bundlerPath", "bundle");
        const ext = process.platform === "win32" && !isWsl ? ".bat" : "";
        return useBundler ? `${bundlerPath}${ext}` : `${executePath}${ext}`;
    }
    /**
     * Returns the command-line options for HTML Beautifier
     * @returns {string[]} The command-line options
     */
    get cliOptions() {
        const config = vscode.workspace.getConfiguration("vscode-erb-beautify");
        const acc = [];
        if (config.get("useBundler")) {
            acc.push("exec", "htmlbeautifier");
        }
        return Object.keys(config).reduce(function (acc, key) {
            switch (key) {
                case "indentBy":
                    acc.push("--indent-by", config[key]);
                    break;
                case "keepBlankLines":
                    acc.push("--keep-blank-lines", config[key]);
                    break;
                case "stopOnErrors":
                    if (config["stopOnErrors"] === true) {
                        acc.push("--stop-on-errors");
                    }
                    break;
                case "tab":
                    if (config["tab"] === true) {
                        acc.push("--tab");
                    }
                    break;
                case "tabStops":
                    acc.push("--tab-stops", config[key]);
                    break;
            }
            return acc;
        }, acc);
    }
    /**
     * Retrieves the custom environment variables from the configuration
     * @returns {Record<string, string>} The custom environment variables
     */
    get customEnvVars() {
        const config = vscode.workspace.getConfiguration("vscode-erb-beautify");
        const customEnvVar = config.get("customEnvVar", {});
        return customEnvVar;
    }
}
exports.default = HtmlBeautifier;
//# sourceMappingURL=htmlbeautifier.js.map