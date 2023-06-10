"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const vscode = require("vscode");
const CfmlSnippetsDataSource_1 = require("../../data/CfmlSnippetsDataSource");
class CfmlSnippetsCompletionProvider {
    constructor() {
        this.dataSource = new CfmlSnippetsDataSource_1.CfmlSnippetsDataSource();
    }
    provideCompletionItems(document, position, token, context) {
        return new Promise((resolve, reject) => {
            this.dataSource.getSnippets().then((cfml) => {
                const completions = [];
                if (cfml === null) {
                    resolve(completions);
                }
                if (cfml.functions !== null) {
                    for (const snippet of cfml.functions) {
                        const item = this.snippet2CompletionItem(snippet);
                        completions.push(item);
                    }
                }
                if (cfml.tags !== null) {
                    for (const snippet of cfml.tags) {
                        const item = this.snippet2CompletionItem(snippet, true, document, position);
                        completions.push(item);
                    }
                }
                return resolve(completions);
            });
        });
    }
    snippet2CompletionItem(snippet, isTag = false, document, position) {
        const prefix = snippet.prefix;
        const item = new vscode.CompletionItem(prefix, vscode.CompletionItemKind.Snippet);
        item.documentation = new vscode.MarkdownString(snippet.documentation);
        // https://github.com/ilich/vscode-coldfusion/issues/32
        let isSnippetSet = false;
        if (isTag) {
            const currentWord = document.getWordRangeAtPosition(position);
            if (currentWord.start.character > 0) {
                const chBeforeRange = new vscode.Range(currentWord.start.line, currentWord.start.character - 1, currentWord.start.line, currentWord.start.character);
                const chBefore = document.getText(chBeforeRange);
                if (chBefore === "<") {
                    item.insertText = new vscode.SnippetString(snippet.body.substr(1));
                    isSnippetSet = true;
                }
            }
        }
        if (!isSnippetSet) {
            item.insertText = new vscode.SnippetString(snippet.body);
        }
        return item;
    }
}
exports.CfmlSnippetsCompletionProvider = CfmlSnippetsCompletionProvider;
//# sourceMappingURL=CfmlSnippetsCompletionProvider.js.map