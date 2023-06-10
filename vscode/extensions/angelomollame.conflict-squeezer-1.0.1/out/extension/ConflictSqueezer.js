"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const vscode = require("vscode");
const Parser_1 = require("./Parser");
class ConflictSqueezer {
    static getSqueezedText(text) {
        try {
            return Parser_1.Parser.parse(text)
                .map(section => section.getText())
                .filter(text => text.length > 0)
                .join("");
        }
        catch (_a) {
            return text;
        }
    }
    static squeezeConflicts() {
        const editor = vscode.window.activeTextEditor;
        if (!editor) {
            return;
        }
        const document = editor.document;
        const text = document.getText();
        const newText = ConflictSqueezer.getSqueezedText(text);
        if (newText !== text) {
            const fullRange = new vscode.Range(document.positionAt(0), document.positionAt(text.length));
            const edit = new vscode.WorkspaceEdit();
            edit.replace(document.uri, fullRange, newText);
            vscode.workspace.applyEdit(edit);
        }
    }
}
exports.ConflictSqueezer = ConflictSqueezer;
//# sourceMappingURL=ConflictSqueezer.js.map