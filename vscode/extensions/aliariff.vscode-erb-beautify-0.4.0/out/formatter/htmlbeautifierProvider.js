"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const vscode = require("vscode");
const htmlbeautifier_1 = require("./htmlbeautifier");
class HtmlBeautifierProvider {
    constructor() {
        this.htmlbeautifier = new htmlbeautifier_1.default();
    }
    /**
     * Provides formatting edits for the entire document
     * @param {vscode.TextDocument} document - The document to be formatted
     * @param {vscode.FormattingOptions} options - The formatting options
     * @param {vscode.CancellationToken} token - The cancellation token
     * @returns {vscode.ProviderResult<vscode.TextEdit[]>} The formatting edits
     */
    provideDocumentFormattingEdits(document, options, token) {
        return this.htmlbeautifier.format(document.getText()).then((result) => {
            return [
                new vscode.TextEdit(document.validateRange(new vscode.Range(0, 0, Infinity, Infinity)), result),
            ];
        }, (err) => {
            // will be handled in format
            return [];
        });
    }
    /**
     * Provides formatting edits for a specific range within the document
     * @param {vscode.TextDocument} document - The document to be formatted
     * @param {vscode.Range} range - The range to be formatted
     * @param {vscode.FormattingOptions} options - The formatting options
     * @param {vscode.CancellationToken} token - The cancellation token
     * @returns {vscode.ProviderResult<vscode.TextEdit[]>} The formatting edits
     */
    provideDocumentRangeFormattingEdits(document, range, options, token) {
        return this.htmlbeautifier.format(document.getText(range)).then((result) => {
            return [new vscode.TextEdit(range, result)];
        }, (err) => {
            // will be handled in format
            return [];
        });
    }
}
exports.default = HtmlBeautifierProvider;
//# sourceMappingURL=htmlbeautifierProvider.js.map