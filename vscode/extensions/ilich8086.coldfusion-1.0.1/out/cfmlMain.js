"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const vscode = require("vscode");
const BlockCommentCommand_1 = require("./editor/commands/BlockCommentCommand");
const LineCommentCommand_1 = require("./editor/commands/LineCommentCommand");
const CfmlSnippetsCompletionProvider_1 = require("./editor/providers/CfmlSnippetsCompletionProvider");
exports.LANGUAGE_ID = "cfml";
function isEnabled(paramName, defaultValue = true) {
    let enabled;
    const config = vscode.workspace.getConfiguration("cfml");
    if (config === null) {
        enabled = defaultValue;
    }
    else {
        enabled = config.get(paramName);
    }
    return enabled;
}
function activateCommentsSupport(context) {
    const lineComment = new LineCommentCommand_1.LineCommentCommand();
    const toggleLineCommentCommand = vscode.commands.registerCommand("cfml.toggleLineComment", lineComment.execute);
    context.subscriptions.push(toggleLineCommentCommand);
    const blockComment = new BlockCommentCommand_1.BlockCommentCommand();
    const toggleBlockCommentCommand = vscode.commands.registerCommand("cfml.toggleBlockComment", blockComment.execute);
    context.subscriptions.push(toggleBlockCommentCommand);
}
function activateSnippets(context) {
    if (!isEnabled("snippets.enabled")) {
        return;
    }
    const snippetsProvider = new CfmlSnippetsCompletionProvider_1.CfmlSnippetsCompletionProvider();
    const provider = vscode.languages.registerCompletionItemProvider(exports.LANGUAGE_ID, snippetsProvider);
    context.subscriptions.push(provider);
}
function activate(context) {
    activateCommentsSupport(context);
    activateSnippets(context);
}
exports.activate = activate;
function deactivate() {
    // TBD. It is not used at the moment.
}
exports.deactivate = deactivate;
//# sourceMappingURL=cfmlMain.js.map