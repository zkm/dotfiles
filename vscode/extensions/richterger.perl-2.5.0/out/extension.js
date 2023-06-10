'use strict';
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.activate = void 0;
const vscode = require("vscode");
const vscode_languageclient_1 = require("vscode-languageclient");
const net = require("net");
// ------------------------------------------------------------------------------
//
// ideas for port checking taken from https://github.com/sindresorhus/get-port
// and the typescript port of hakonhagland
//
function check_available_port(port) {
    return new Promise((resolve, reject) => {
        const server = net.createServer();
        server.unref();
        server.on('error', reject);
        server.listen({ host: '127.0.0.1', port: port }, () => {
            //const addr = server.address();
            server.close(() => {
                resolve(port);
            });
        });
    });
}
// ------------------------------------------------------------------------------
function get_available_port(port, port_range) {
    return __awaiter(this, void 0, void 0, function* () {
        for (var i = 0; i < port_range; i++) {
            try {
                console.log('try if port ' + (port + i) + ' is available');
                return yield check_available_port(port + i);
            }
            catch (error) {
                let errorCode = error;
                if (errorCode.code === undefined) {
                    throw error;
                }
                else {
                    if (!['EADDRNOTAVAIL', 'EINVAL', 'EADDRINUSE'].includes(errorCode.code)) {
                        throw error;
                    }
                }
            }
        }
        return 0;
    });
}
// ------------------------------------------------------------------------------
function resolve_workspaceFolder(path, resource) {
    var _a, _b, _c;
    if (path.includes("${workspaceFolder}")) {
        const ws = (_a = vscode.workspace.getWorkspaceFolder(resource)) !== null && _a !== void 0 ? _a : (_b = vscode.workspace.workspaceFolders) === null || _b === void 0 ? void 0 : _b[0];
        const sub = (_c = ws === null || ws === void 0 ? void 0 : ws.uri.fsPath) !== null && _c !== void 0 ? _c : "";
        return path.replace("${workspaceFolder}", sub);
    }
    return path;
}
// ------------------------------------------------------------------------------
function buildContainerArgs(containerCmd, containerArgs, containerName, containerMode) {
    //console.log ('buildContainerArgs enter: ' + containerCmd + ' args ' + containerArgs.join (' ') + '  name ' + containerName + ' mode ' + containerMode)  ;
    if (containerMode != 'exec')
        containerMode = 'run';
    if (containerCmd) {
        if (containerArgs.length == 0) {
            if (containerCmd == 'docker') {
                containerArgs.push(containerMode);
                if (containerMode == 'run')
                    containerArgs.push('--rm');
                containerArgs.push('-i', containerName);
            }
            else if (containerCmd == 'docker-compose') {
                containerArgs.push(containerMode);
                if (containerMode == 'run')
                    containerArgs.push('--rm');
                containerArgs.push('--no-deps', '-T', containerName);
            }
            else if (containerCmd == 'kubectl') {
                containerArgs.push('exec', containerName, '-i', '--');
            }
            else if (containerCmd == 'devspace') {
                containerArgs.push('--silent ', 'enter');
                if (containerName)
                    containerArgs.push('-c', containerName);
                containerArgs.push('--');
            }
        }
    }
    //console.log ('buildContainerArgs exit: ' + containerCmd + ' args ' + containerArgs.join (' ') + '  name ' + containerName + ' mode ' + containerMode)  ;
    return containerArgs;
}
// ------------------------------------------------------------------------------
function activate(context) {
    var _a;
    return __awaiter(this, void 0, void 0, function* () {
        let config = vscode.workspace.getConfiguration('perl');
        if (!config.get('enable')) {
            console.log('extension "perl" is disabled');
            return;
        }
        console.log('extension "perl" is now active');
        let env = {};
        if (!config.get('disablePassEnv')) {
            var k;
            for (k in process.env) {
                env[k] = process.env[k];
                console.log('env: ' + k + ' = ' + env[k]);
            }
        }
        let resource = (_a = vscode.window.activeTextEditor) === null || _a === void 0 ? void 0 : _a.document.uri;
        let containerCmd = config.get('containerCmd') || '';
        let containerArgs = config.get('containerArgs') || [];
        let containerName = config.get('containerName') || '';
        let containerMode = config.get('containerMode') || 'exec';
        let debug_adapter_port = config.get('debugAdapterPort') || 13603;
        let debug_adapter_port_range = config.get('debugAdapterPortRange') || 100;
        if (!containerCmd) {
            debug_adapter_port = yield get_available_port(debug_adapter_port, debug_adapter_port_range);
            console.log('use ' + debug_adapter_port + ' as debug adapter port');
        }
        let perlCmd = resolve_workspaceFolder((config.get('perlCmd') || 'perl'), resource);
        let perlArgs = config.get('perlArgs') || [];
        let perlInc = config.get('perlInc') || [];
        let perlIncOpt = perlInc.map((dir) => "-I" + resolve_workspaceFolder(dir, resource));
        let addenv = config.get('env') || {};
        var k;
        for (k in addenv) {
            env[k] = addenv[k];
            console.log('addenv: ' + k + ' = ' + env[k]);
        }
        let logFile = config.get('logFile') || '';
        let logLevel = config.get('logLevel') || 0;
        let client_version = "2.5.0";
        let perlArgsOpt = [...perlIncOpt,
            ...perlArgs,
            '-MPerl::LanguageServer', '-e', 'Perl::LanguageServer::run', '--',
            '--port', debug_adapter_port.toString(),
            '--log-level', logLevel.toString(),
            '--log-file', logFile,
            '--version', client_version];
        let sshPortOption = '-p';
        let sshCmd = config.get('sshCmd') || '';
        if (!sshCmd) {
            if (/^win/.test(process.platform)) {
                sshCmd = 'plink';
                sshPortOption = '-P';
            }
            else {
                sshCmd = 'ssh';
            }
        }
        let sshArgs = config.get('sshArgs') || [];
        let sshUser = config.get('sshUser') || '';
        let sshAddr = config.get('sshAddr') || '';
        let sshPort = config.get('sshPort') || '';
        let containerArgsOpt = buildContainerArgs(containerCmd, containerArgs, containerName, containerMode);
        var serverCmd;
        var serverArgs;
        if (sshAddr && sshUser) {
            serverCmd = sshCmd;
            if (sshPort) {
                sshArgs.push(sshPortOption, sshPort);
            }
            sshArgs.push('-l', sshUser, sshAddr, '-L', debug_adapter_port + ':127.0.0.1:' + debug_adapter_port);
            if (containerCmd) {
                sshArgs.push(containerCmd);
                sshArgs = sshArgs.concat(containerArgsOpt);
            }
            sshArgs.push(perlCmd);
            serverArgs = sshArgs.concat(perlArgsOpt);
        }
        else {
            if (containerCmd) {
                serverCmd = containerCmd;
                serverArgs = containerArgsOpt.concat(perlCmd, perlArgsOpt);
            }
            else {
                serverCmd = perlCmd;
                serverArgs = perlArgsOpt;
            }
        }
        vscode.debug.registerDebugAdapterDescriptorFactory('perl', {
            createDebugAdapterDescriptor(session, executable) {
                let cfg = session.configuration;
                let debugContainerCmd = cfg.containerCmd || containerCmd;
                let debugContainerArgs = cfg.containerArgs || containerArgs;
                let debugContainerName = cfg.containerName || containerName;
                let debugContainerMode = cfg.containerMode || containerMode;
                let debugContainerArgsOpt = buildContainerArgs(debugContainerCmd, debugContainerArgs, debugContainerName, debugContainerMode);
                if (debugContainerCmd) {
                    var daCmd;
                    var daArgs;
                    if (containerCmd) {
                        // LanguageServer already running inside container
                        daArgs = debugContainerArgsOpt.concat([perlCmd, ...perlIncOpt,
                            ...perlArgs,
                            '-MPerl::LanguageServer::DebuggerBridge', '-e', 'Perl::LanguageServer::DebuggerBridge::run',
                            debug_adapter_port.toString()]);
                    }
                    else {
                        // LanguageServer not running inside container
                        daArgs = debugContainerArgsOpt.concat([perlCmd, ...perlArgsOpt]);
                    }
                    daCmd = debugContainerCmd;
                    console.log('start perl debug adapter in container: ' + daCmd + ' ' + daArgs.join(' '));
                    return new vscode.DebugAdapterExecutable(daCmd, daArgs, { env: env });
                }
                else {
                    // TODO: use SocketDebugAdapter
                    //return new vscode.SocketDebugAdapter () ;
                    executable.args.push(debug_adapter_port.toString());
                }
                console.log('start perl debug adapter: ' + executable.command + ' ' + executable.args.join(' '));
                return executable;
            }
        });
        vscode.debug.registerDebugConfigurationProvider('perl', {
            resolveDebugConfiguration(folder, config, token) {
                console.log('start perl debug resolveDebugConfiguration');
                if (!config.request) {
                    console.log('config perl debug resolveDebugConfiguration');
                    var dbgconfig = {
                        type: "perl",
                        request: "launch",
                        name: "Perl-Debug",
                        program: "${workspaceFolder}/${relativeFile}",
                        stopOnEntry: true,
                        reloadModules: true
                    };
                    return dbgconfig;
                }
                return config;
            }
        }, vscode.DebugConfigurationProviderTriggerKind.Dynamic);
        console.log('cmd: ' + serverCmd + ' args: ' + serverArgs.join(' '));
        let debugArgs = serverArgs.concat(["--debug"]);
        let serverOptions = {
            run: { command: serverCmd, args: serverArgs, options: { env: env } },
            debug: { command: serverCmd, args: debugArgs, options: { env: env } },
        };
        // Options to control the language client
        let clientOptions = {
            // Register the server for plain text documents
            documentSelector: [{ scheme: 'file', language: 'perl' }],
            synchronize: {
                // Synchronize the setting section 'perl_lang' to the server
                configurationSection: 'perl',
            }
        };
        // Create the language client and start the client.
        let disposable = new vscode_languageclient_1.LanguageClient('perl', 'Perl Language Server', serverOptions, clientOptions).start();
        // Push the disposable to the context's subscriptions so that the
        // client can be deactivated on extension deactivation
        context.subscriptions.push(disposable);
    });
}
exports.activate = activate;
//# sourceMappingURL=extension.js.map