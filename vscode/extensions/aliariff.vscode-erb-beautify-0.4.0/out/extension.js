"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deactivate = exports.activate = void 0;
const vscode = require("vscode");
const htmlbeautifierProvider_1 = require("./formatter/htmlbeautifierProvider");
/**
 * Activates the extension
 * @param {vscode.ExtensionContext} context - The extension context
 */
function activate(context) {
    context.subscriptions.push(vscode.languages.registerDocumentFormattingEditProvider("erb", new htmlbeautifierProvider_1.default()), vscode.languages.registerDocumentRangeFormattingEditProvider("erb", new htmlbeautifierProvider_1.default()));
}
exports.activate = activate;
/**
 * Deactivates the extension
 */
function deactivate() { }
exports.deactivate = deactivate;
//# sourceMappingURL=extension.js.map