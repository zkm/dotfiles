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
const path_1 = __importDefault(require("path"));
const os_1 = __importDefault(require("os"));
const minimatch_1 = __importDefault(require("minimatch"));
const vscode_1 = require("vscode");
const vscode_languageclient_1 = require("vscode-languageclient");
const node_1 = require("vscode-languageclient/node");
const telemetryReporter_1 = __importDefault(require("../../telemetryReporter"));
const util_1 = require("../../util");
const env_paths_1 = __importDefault(require("env-paths"));
const watcher_1 = __importDefault(require("watcher"));
const packageJson = require('../../../../package.json'); // eslint-disable-line
let client;
let serverModule;
let telemetry;
let fileWatcher;
const isDebugMode = () => process.env.VSCODE_DEBUG_MODE === 'true';
const isE2ETestOnPullRequest = () => process.env.PRISMA_USE_LOCAL_LS === 'true';
const activateClient = (context, serverOptions, clientOptions) => {
    // Create the language client
    client = (0, util_1.createLanguageServer)(serverOptions, clientOptions);
    const disposable = client.start();
    // Start the client. This will also launch the server
    context.subscriptions.push(disposable);
};
const onFileChange = (filepath) => {
    console.debug(`File ${filepath} has changed, restarting TS Server.`);
    void vscode_1.commands.executeCommand('typescript.restartTsServer');
};
function startGenerateWatcher() {
    var _a;
    if (fileWatcher !== undefined)
        return;
    // macOS watcher to be removed in future releases
    const rootPath = (_a = vscode_1.workspace.workspaceFolders) === null || _a === void 0 ? void 0 : _a[0].uri.path;
    if (os_1.default.platform() === 'darwin' && rootPath !== undefined) {
        fileWatcher = new watcher_1.default(rootPath, {
            depth: 9,
            debounce: 500,
            recursive: true,
            ignoreInitial: true,
            ignore: (targetPath) => {
                if (targetPath === rootPath)
                    return false;
                return !(0, minimatch_1.default)(targetPath, '**/node_modules/.prisma/client/index.d.ts');
            },
        });
        console.log(`Watching ${rootPath} for changes (old watcher).`);
    }
    else {
        const prismaCache = (0, env_paths_1.default)('prisma').cache;
        const signalsPath = path_1.default.join(prismaCache, 'last-generate');
        const fwOptions = { debounce: 500, ignoreInitial: true };
        fileWatcher = new watcher_1.default(signalsPath, fwOptions);
        console.log(`Watching ${signalsPath} for changes (new watcher).`);
    }
    fileWatcher.on('change', onFileChange);
    fileWatcher.on('add', onFileChange);
}
function stopGenerateWatcher() {
    if (fileWatcher === undefined)
        return;
    fileWatcher.close();
    fileWatcher = undefined;
    console.log('Stopped watching for changes.');
}
function setGenerateWatcher(enabled) {
    if (enabled) {
        startGenerateWatcher();
    }
    else {
        stopGenerateWatcher();
    }
}
const plugin = {
    name: 'prisma-language-server',
    enabled: () => true,
    activate: (context) => __awaiter(void 0, void 0, void 0, function* () {
        const isDebugOrTest = (0, util_1.isDebugOrTestSession)();
        setGenerateWatcher(!!vscode_1.workspace.getConfiguration('prisma').get('fileWatcher'));
        // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
        if (packageJson.name === 'prisma-insider-pr-build') {
            console.log('Using local Language Server for prisma-insider-pr-build');
            serverModule = context.asAbsolutePath(path_1.default.join('./language-server/dist/src/bin'));
        }
        else if (isDebugMode() || isE2ETestOnPullRequest()) {
            // use Language Server from folder for debugging
            console.log('Using local Language Server from filesystem');
            serverModule = context.asAbsolutePath(path_1.default.join('../../packages/language-server/dist/src/bin'));
        }
        else {
            console.log('Using published Language Server (npm)');
            // use published npm package for production
            serverModule = require.resolve('@prisma/language-server/dist/src/bin');
        }
        console.log(`serverModule: ${serverModule}`);
        // The debug options for the server
        // --inspect=6009: runs the server in Node's Inspector mode so VSCode can attach to the server for debugging
        const debugOptions = {
            execArgv: ['--nolazy', '--inspect=6009'],
            env: { DEBUG: true },
        };
        // If the extension is launched in debug mode then the debug server options are used
        // Otherwise the run options are used
        const serverOptions = {
            run: { module: serverModule, transport: node_1.TransportKind.ipc },
            debug: {
                module: serverModule,
                transport: node_1.TransportKind.ipc,
                options: debugOptions,
            },
        };
        // Options to control the language client
        const clientOptions = {
            // Register the server for prisma documents
            documentSelector: [{ scheme: 'file', language: 'prisma' }],
            /* This middleware is part of the workaround for https://github.com/prisma/language-tools/issues/311 */
            // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
            middleware: {
                provideCodeActions(document, range, context, token, _) {
                    return __awaiter(this, void 0, void 0, function* () {
                        const params = {
                            textDocument: client.code2ProtocolConverter.asTextDocumentIdentifier(document),
                            range: client.code2ProtocolConverter.asRange(range),
                            context: client.code2ProtocolConverter.asCodeActionContext(context),
                        };
                        return client.sendRequest(vscode_languageclient_1.CodeActionRequest.type, params, token).then((values) => {
                            if (values === null)
                                return undefined;
                            const result = [];
                            for (const item of values) {
                                if (vscode_languageclient_1.CodeAction.is(item)) {
                                    const action = client.protocol2CodeConverter.asCodeAction(item);
                                    if ((0, util_1.isSnippetEdit)(item, client.code2ProtocolConverter.asTextDocumentIdentifier(document)) &&
                                        item.edit !== undefined) {
                                        action.command = {
                                            command: 'prisma.applySnippetWorkspaceEdit',
                                            title: '',
                                            arguments: [action.edit],
                                        };
                                        action.edit = undefined;
                                    }
                                    result.push(action);
                                }
                                else {
                                    const command = client.protocol2CodeConverter.asCommand(item);
                                    result.push(command);
                                }
                            }
                            return result;
                        }, (_) => undefined);
                    });
                },
            }, // eslint-disable-line @typescript-eslint/no-explicit-any
        };
        context.subscriptions.push(
        // when the file watcher settings change, we need to ensure they are applied
        vscode_1.workspace.onDidChangeConfiguration((event) => {
            if (event.affectsConfiguration('prisma.fileWatcher')) {
                setGenerateWatcher(!!vscode_1.workspace.getConfiguration('prisma').get('fileWatcher'));
            }
        }), vscode_1.commands.registerCommand('prisma.restartLanguageServer', () => __awaiter(void 0, void 0, void 0, function* () {
            client = yield (0, util_1.restartClient)(context, client, serverOptions, clientOptions);
            vscode_1.window.showInformationMessage('Prisma language server restarted.'); // eslint-disable-line @typescript-eslint/no-floating-promises
        })), 
        /* This command is part of the workaround for https://github.com/prisma/language-tools/issues/311 */
        vscode_1.commands.registerCommand('prisma.applySnippetWorkspaceEdit', (0, util_1.applySnippetWorkspaceEdit)()), vscode_1.commands.registerCommand('prisma.filewatcherEnable', () => __awaiter(void 0, void 0, void 0, function* () {
            const prismaConfig = vscode_1.workspace.getConfiguration('prisma');
            yield prismaConfig.update('fileWatcher', true /* value */, false /* workspace */);
        })), vscode_1.commands.registerCommand('prisma.filewatcherDisable', () => __awaiter(void 0, void 0, void 0, function* () {
            const prismaConfig = vscode_1.workspace.getConfiguration('prisma');
            yield prismaConfig.update('fileWatcher', false /* value */, false /* workspace */);
        })));
        activateClient(context, serverOptions, clientOptions);
        if (!isDebugOrTest) {
            // eslint-disable-next-line
            const extensionId = 'prisma.' + packageJson.name;
            // eslint-disable-next-line
            const extensionVersion = packageJson.version;
            telemetry = new telemetryReporter_1.default(extensionId, extensionVersion);
            context.subscriptions.push(telemetry);
            yield telemetry.sendTelemetryEvent();
            if (extensionId === 'prisma.prisma-insider') {
                (0, util_1.checkForOtherPrismaExtension)();
            }
        }
        (0, util_1.checkForMinimalColorTheme)();
    }),
    deactivate: () => __awaiter(void 0, void 0, void 0, function* () {
        if (!client) {
            return undefined;
        }
        if (!(0, util_1.isDebugOrTestSession)()) {
            telemetry.dispose(); // eslint-disable-line @typescript-eslint/no-floating-promises
        }
        return client.stop();
    }),
};
exports.default = plugin;
//# sourceMappingURL=index.js.map