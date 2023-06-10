"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const vscode = require("vscode");
const ConflictSqueezer_1 = require("./ConflictSqueezer");
function activate(context) {
    context.subscriptions.push(vscode.commands.registerCommand("conflictSqueezer.squeezeConflicts", () => ConflictSqueezer_1.ConflictSqueezer.squeezeConflicts()));
}
exports.activate = activate;
//# sourceMappingURL=Extension.js.map