"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const vscode = require("vscode");
class ScriptContext {
    constructor(document) {
        this.cfqueryBegin = new RegExp("<cfquery", "ig");
        this.cfqueryEnd = new RegExp("<\/cfquery", "ig");
        this.cfscriptBegin = new RegExp("<cfscript", "ig");
        this.cfscriptEnd = new RegExp("<\/cfscript", "ig");
        this.scriptBegin = new RegExp("<script", "ig");
        this.scriptEnd = new RegExp("<\/script", "ig");
        this.anyCfml = new RegExp("<cf", "ig");
        this.document = document;
    }
    isScript(position) {
        let text = this.document.getText();
        if (!text.match(this.anyCfml)) {
            return true;
        }
        const range = new vscode.Range(new vscode.Position(0, 0), position);
        text = this.document.getText(range);
        let result = this.isBetweenTags(text, this.cfscriptBegin, this.cfscriptEnd);
        if (!result) {
            // check. it might be JavaScript tag.
            result = this.isBetweenTags(text, this.scriptBegin, this.scriptEnd);
        }
        return result;
    }
    isCFQuery(position) {
        const range = new vscode.Range(new vscode.Position(0, 0), position);
        const text = this.document.getText(range);
        const result = this.isBetweenTags(text, this.cfqueryBegin, this.cfqueryEnd);
        return result;
    }
    isBetweenTags(text, start, end) {
        let lastBegin = -1;
        let lastEnd = -1;
        let match;
        match = start.exec(text);
        while (match !== null) {
            lastBegin = match.index;
            match = start.exec(text);
        }
        match = end.exec(text);
        while (match !== null) {
            lastEnd = match.index;
            match = end.exec(text);
        }
        return lastBegin > lastEnd;
    }
}
exports.ScriptContext = ScriptContext;
//# sourceMappingURL=ScriptContext.js.map