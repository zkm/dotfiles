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
const checkpoint_client_1 = require("checkpoint-client");
const vscode_1 = require("vscode");
const hashes_1 = require("./hashes");
class TelemetryReporter {
    constructor(extensionId, extensionVersion) {
        this.extensionId = extensionId;
        this.extensionVersion = extensionVersion;
        this.userOptIn = false;
        this.updateUserOptIn();
        this.configListener = vscode_1.workspace.onDidChangeConfiguration(() => this.updateUserOptIn());
    }
    sendTelemetryEvent() {
        return __awaiter(this, void 0, void 0, function* () {
            if (this.userOptIn) {
                yield (0, checkpoint_client_1.check)({
                    product: this.extensionId,
                    version: this.extensionVersion,
                    project_hash: yield (0, hashes_1.getProjectHash)(),
                });
            }
        });
    }
    updateUserOptIn() {
        const config = vscode_1.workspace.getConfiguration(TelemetryReporter.TELEMETRY_CONFIG_ID);
        if (this.userOptIn !== config.get(TelemetryReporter.TELEMETRY_CONFIG_ENABLED_ID, true)) {
            this.userOptIn = config.get(TelemetryReporter.TELEMETRY_CONFIG_ENABLED_ID, true);
        }
    }
    dispose() {
        this.configListener.dispose();
    }
}
TelemetryReporter.TELEMETRY_CONFIG_ID = 'telemetry';
TelemetryReporter.TELEMETRY_CONFIG_ENABLED_ID = 'enableTelemetry';
exports.default = TelemetryReporter;
//# sourceMappingURL=telemetryReporter.js.map