"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const vscode = require("vscode");
const rufo_1 = require("./rufo");
class EditProvider {
    constructor() {
        this.rufo = new rufo_1.default();
    }
    register(ctx, documentSelector) {
        this.rufo.test().then(() => {
            ctx.subscriptions.push(vscode.languages.registerDocumentFormattingEditProvider(documentSelector, this), vscode.languages.registerDocumentRangeFormattingEditProvider(documentSelector, this));
        });
    }
    provideDocumentFormattingEdits(document, options, token) {
        const range = document.validateRange(new vscode.Range(0, 0, Infinity, Infinity));
        return this.formatDocument(document, range);
    }
    provideDocumentRangeFormattingEdits(document, range, options, token) {
        return this.formatDocument(document, range);
    }
    formatDocument(document, range) {
        const fileName = document.fileName ? document.fileName : vscode.workspace.rootPath;
        const input = document.getText(range);
        return this.rufo.format(input, fileName)
            .then(result => {
            if (this.shouldRemoveTrailingNewline(document, range, result)) {
                result = result.slice(0, -1);
            }
            return [new vscode.TextEdit(document.validateRange(range), result)];
        }, err => {
            // will be handled in format
            return [];
        });
    }
    shouldRemoveTrailingNewline(document, range, result) {
        return range.end.line !== document.lineCount - 1 && result.slice(-1) === '\n';
    }
}
exports.default = EditProvider;
//# sourceMappingURL=edit_provider.js.map