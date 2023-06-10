"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const vscode = require("vscode");
const cfmlMain_1 = require("../../cfmlMain");
const ScriptContext_1 = require("../../parser/ScriptContext");
class LineCommentCommand {
    execute() {
        const editor = vscode.window.activeTextEditor;
        const context = new ScriptContext_1.ScriptContext(editor.document);
        const line = editor.document.lineAt(editor.selection.start.line);
        let position = line.range.end;
        // first we should check if current selection starts with </cfscript> or </script>.
        // in this case we should start checking context after </cfscript> tag.
        // the same is applicable for <cfscript> and <script> tags.
        if (/[\s\t]*<\/[c]?[f]?script>/ig.test(line.text)) {
            position = line.range.end;
        }
        else if (/[\s\t]*<[c]?[f]?script>/ig.test(line.text)) {
            position = line.range.start;
        }
        let executeCommand = true;
        const command = "editor.action.commentLine";
        let config = {
            comments: {
                lineComment: "//",
            },
        };
        if (context.isCFQuery(position)) {
            // this is cfquery
            config = {
                comments: {
                    lineComment: "--",
                },
            };
        }
        else if (!context.isScript(position)) {
            // it is not a cfquery or cfscript or script tag
            // apply cfml comment manually
            executeCommand = false;
            editor.edit((builder) => {
                const range = line.range;
                builder.insert(range.start, "<!--- ");
                builder.insert(range.end, " --->");
            });
        }
        if (executeCommand) {
            vscode.languages.setLanguageConfiguration(cfmlMain_1.LANGUAGE_ID, config);
            vscode.commands.executeCommand(command);
        }
    }
}
exports.LineCommentCommand = LineCommentCommand;
//# sourceMappingURL=LineCommentCommand.js.map