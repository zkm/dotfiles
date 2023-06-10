"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deactivate = exports.activate = void 0;
const formatter_1 = require("./formatter");
const DOCUMENT_SELECTOR = [
    { language: 'ruby', scheme: 'file' },
    { language: 'ruby', scheme: 'untitled' },
    { language: 'erb', scheme: 'file' },
    { language: 'erb', scheme: 'untitled' },
    { language: 'gemfile', scheme: 'file' },
    { language: 'gemfile', scheme: 'untitled' },
];
function activate(context) {
    // register Rufo-based formatter
    (0, formatter_1.default)(context, DOCUMENT_SELECTOR);
}
exports.activate = activate;
function deactivate() {
    // nothing yet
}
exports.deactivate = deactivate;
//# sourceMappingURL=extension.js.map