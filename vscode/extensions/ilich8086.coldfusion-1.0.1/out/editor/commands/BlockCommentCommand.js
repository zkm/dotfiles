"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const vscode = require("vscode");
const cfmlMain_1 = require("../../cfmlMain");
const ScriptContext_1 = require("../../parser/ScriptContext");
class BlockCommentCommand {
    execute() {
        const editor = vscode.window.activeTextEditor;
        const context = new ScriptContext_1.ScriptContext(editor.document);
        let position = editor.selection.start;
        // first we should check if current selection starts with </cfscript>.
        // in this case we should start checking context after </cfscript> tag.
        // this is a workaround to support block comments.
        const selectedText = editor.document.getText(editor.selection);
        if (/[\s\t]*<\/[c]?[f]?script>/ig.test(selectedText)) {
            const line = editor.document.lineAt(position.line);
            position = line.range.end;
        }
        let config = {
            comments: {
                blockComment: ["/*", "*/"],
            },
        };
        if (!context.isScript(position) && !context.isCFQuery(position)) {
            config = {
                comments: {
                    blockComment: ["<!---", "--->"],
                },
            };
        }
        vscode.languages.setLanguageConfiguration(cfmlMain_1.LANGUAGE_ID, config);
        vscode.commands.executeCommand("editor.action.blockComment");
    }
}
exports.BlockCommentCommand = BlockCommentCommand;
//# sourceMappingURL=BlockCommentCommand.js.map