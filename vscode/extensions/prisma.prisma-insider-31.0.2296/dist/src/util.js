"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.restartClient = exports.createLanguageServer = exports.applySnippetWorkspaceEdit = exports.isSnippetEdit = exports.checkForMinimalColorTheme = exports.checkForOtherPrismaExtension = exports.isDebugOrTestSession = void 0;
const vscode_1 = require("vscode");
const node_1 = require("vscode-languageclient/node");
const denyListColorThemes_1 = require("./denyListColorThemes");
const os_1 = require("os");
const fs_1 = require("fs");
const path_1 = __importDefault(require("path"));
function isDebugOrTestSession() {
    return vscode_1.env.sessionId === 'someValue.sessionId';
}
exports.isDebugOrTestSession = isDebugOrTestSession;
function checkForOtherPrismaExtension() {
    const files = (0, fs_1.readdirSync)(path_1.default.join((0, os_1.homedir)(), '.vscode/extensions')).filter((file) => file.toLowerCase().startsWith('prisma.prisma-') && !file.toLowerCase().startsWith('prisma.prisma-insider-'));
    if (files.length !== 0) {
        // eslint-disable-next-line @typescript-eslint/no-floating-promises
        vscode_1.window.showInformationMessage(`You have both both versions (Insider and Stable) of the Prisma VS Code extension enabled in your workspace. Please uninstall or disable one of them for a better experience.`);
        console.log('Both versions (Insider and Stable) of the Prisma VS Code extension are enabled.');
    }
}
exports.checkForOtherPrismaExtension = checkForOtherPrismaExtension;
function showToastToSwitchColorTheme(currentTheme, suggestedTheme) {
    // We do not want to block on this UI message, therefore disabling the linter here.
    // eslint-disable-next-line @typescript-eslint/no-floating-promises
    vscode_1.window.showWarningMessage(`The VSCode Color Theme '${currentTheme}' you are using unfortunately does not fully support syntax highlighting. We suggest you switch to '${suggestedTheme}' which does fully support it and will give you a better experience.`);
}
function checkForMinimalColorTheme() {
    const colorTheme = vscode_1.workspace.getConfiguration('workbench').get('colorTheme');
    if (!colorTheme) {
        return;
    }
    console.log(colorTheme);
    if (denyListColorThemes_1.denyListDarkColorThemes.includes(colorTheme)) {
        showToastToSwitchColorTheme(colorTheme, 'Dark+ (Visual Studio)');
    }
    if (denyListColorThemes_1.denyListLightColorThemes.includes(colorTheme)) {
        showToastToSwitchColorTheme(colorTheme, 'Light+ (Visual Studio)');
    }
}
exports.checkForMinimalColorTheme = checkForMinimalColorTheme;
/* This function is part of the workaround for https://github.com/prisma/language-tools/issues/311 */
function isSnippetEdit(action, document) {
    var _a;
    const changes = (_a = action.edit) === null || _a === void 0 ? void 0 : _a.changes;
    if (changes !== undefined && changes[document.uri]) {
        if (changes[document.uri].some((e) => e.newText.includes('{\n\n}\n'))) {
            return true;
        }
    }
    return false;
}
exports.isSnippetEdit = isSnippetEdit;
/* This function is part of the workaround for https://github.com/prisma/language-tools/issues/311 */
function applySnippetWorkspaceEdit() {
    return (edit) => __awaiter(this, void 0, void 0, function* () {
        const [uri, edits] = edit.entries()[0];
        const editor = vscode_1.window.visibleTextEditors.find((it) => it.document.uri.toString() === uri.toString());
        if (!editor)
            return;
        let editWithSnippet = undefined;
        let lineDelta = 0;
        yield editor.edit((builder) => {
            for (const indel of edits) {
                if (indel.newText.includes('$0')) {
                    editWithSnippet = indel;
                }
                else if (indel.newText.includes('{\n\n}')) {
                    indel.newText = indel.newText.replace('{\n\n}', '{\n\t$0\n}');
                    editWithSnippet = indel;
                }
                else {
                    if (!editWithSnippet) {
                        lineDelta = (indel.newText.match(/\n/g) || []).length - (indel.range.end.line - indel.range.start.line);
                    }
                    builder.replace(indel.range, indel.newText);
                }
            }
        });
        if (editWithSnippet) {
            const snip = editWithSnippet;
            const range = snip.range.with(snip.range.start.with(snip.range.start.line + lineDelta), snip.range.end.with(snip.range.end.line + lineDelta));
            yield editor.insertSnippet(new vscode_1.SnippetString(snip.newText), range);
        }
    });
}
exports.applySnippetWorkspaceEdit = applySnippetWorkspaceEdit;
function createLanguageServer(serverOptions, clientOptions) {
    return new node_1.LanguageClient('prisma', 'Prisma Language Server', serverOptions, clientOptions);
}
exports.createLanguageServer = createLanguageServer;
const restartClient = (context, client, serverOptions, clientOptions) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    (_a = client === null || client === void 0 ? void 0 : client.diagnostics) === null || _a === void 0 ? void 0 : _a.dispose();
    if (client)
        yield client.stop();
    client = createLanguageServer(serverOptions, clientOptions);
    context.subscriptions.push(client.start());
    yield client.onReady();
    return client;
});
exports.restartClient = restartClient;
//# sourceMappingURL=util.js.map