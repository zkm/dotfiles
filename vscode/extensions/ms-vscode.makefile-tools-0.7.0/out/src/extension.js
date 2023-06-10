"use strict";
// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.
Object.defineProperty(exports, "__esModule", { value: true });
exports.deactivate = exports.activate = exports.MakefileToolsExtension = exports.extension = void 0;
// Makefile Tools extension
const configuration = require("./configuration");
const cpptools = require("./cpptools");
const launch = require("./launch");
const make = require("./make");
const path = require("path");
const state = require("./state");
const telemetry = require("./telemetry");
const tree = require("./tree");
const ui = require("./ui");
const util = require("./util");
const vscode = require("vscode");
const cpp = require("vscode-cpptools");
const nls = require("vscode-nls");
nls.config({ messageFormat: nls.MessageFormat.bundle, bundleFormat: nls.BundleFormat.standalone })(__filename);
const localize = nls.loadMessageBundle(__filename);
let statusBar = ui.getUI();
let launcher = launch.getLauncher();
class MakefileToolsExtension {
    getCppConfigurationProvider() { return this.cppConfigurationProvider; }
    constructor(extensionContext) {
        this.extensionContext = extensionContext;
        this._projectOutlineProvider = new tree.ProjectOutlineProvider();
        this._projectOutlineTreeView = vscode.window.createTreeView('makefile.outline', {
            treeDataProvider: this._projectOutlineProvider,
            showCollapseAll: false
        });
        this.cppConfigurationProvider = new cpptools.CppConfigurationProvider();
        this.mementoState = new state.StateManager(this.extensionContext);
        this.fullFeatureSet = false;
        // Used for calling cppToolsAPI.notifyReady only once in a VSCode session.
        this.ranNotifyReadyInSession = false;
        // Similar to state.ranConfigureInCodebaseLifetime, but at the scope of a VSCode session
        this.completedConfigureInSession = false;
        this.cummulativeBrowsePath = [];
    }
    getState() { return this.mementoState; }
    dispose() {
        this._projectOutlineTreeView.dispose();
        if (this.cppToolsAPI) {
            this.cppToolsAPI.dispose();
        }
    }
    getFullFeatureSet() { return this.fullFeatureSet; }
    async setFullFeatureSet(newValue) {
        await vscode.commands.executeCommand('setContext', "makefile:fullFeatureSet", newValue);
        this.fullFeatureSet = newValue;
    }
    getRanNotifyReadyInSession() { return this.ranNotifyReadyInSession; }
    setRanNotifyReadyInSession(ran) { this.ranNotifyReadyInSession = ran; }
    getCompletedConfigureInSession() { return this.completedConfigureInSession; }
    setCompletedConfigureInSession(completed) { this.completedConfigureInSession = completed; }
    // Register this extension as a new provider or request an update
    async registerCppToolsProvider() {
        await this.ensureCppToolsProviderRegistered();
        // Call notifyReady earlier than when the provider is updated,
        // as soon as we know that we are going to actually parse for IntelliSense.
        // This allows CppTools to ask earlier about source files in use
        // and Makefile Tools may return a targeted source file configuration
        // if it was already computed in our internal arrays (make.ts: customConfigProviderItems).
        // If the requested file isn't yet processed, it will get updated when configure is finished.
        // TODO: remember all requests that are coming and send an update as soon as we detect
        // any of them being pushed into make.customConfigProviderItems.
        if (this.cppToolsAPI) {
            if (!this.ranNotifyReadyInSession && this.cppToolsAPI.notifyReady) {
                this.cppToolsAPI.notifyReady(this.cppConfigurationProvider);
                this.setRanNotifyReadyInSession(true);
            }
        }
    }
    // Request a custom config provider update.
    updateCppToolsProvider() {
        this.cppConfigurationProvider.logConfigurationProviderBrowse();
        if (this.cppToolsAPI) {
            this.cppToolsAPI.didChangeCustomConfiguration(this.cppConfigurationProvider);
        }
    }
    ensureCppToolsProviderRegistered() {
        // make sure this extension is registered as provider only once
        if (!this.cppConfigurationProviderRegister) {
            this.cppConfigurationProviderRegister = this.registerCppTools();
        }
        return this.cppConfigurationProviderRegister;
    }
    getCppToolsVersion() {
        var _a;
        return (_a = this.cppToolsAPI) === null || _a === void 0 ? void 0 : _a.getVersion();
    }
    async registerCppTools() {
        if (!this.cppToolsAPI) {
            this.cppToolsAPI = await cpp.getCppToolsApi(cpp.Version.v6);
        }
        if (this.cppToolsAPI) {
            this.cppToolsAPI.registerCustomConfigurationProvider(this.cppConfigurationProvider);
        }
    }
    clearCummulativeBrowsePath() {
        this.cummulativeBrowsePath = [];
    }
    buildCustomConfigurationProvider(customConfigProviderItem) {
        this.compilerFullPath = customConfigProviderItem.compilerFullPath;
        let provider = make.getDeltaCustomConfigurationProvider();
        const configuration = {
            defines: customConfigProviderItem.defines,
            standard: customConfigProviderItem.standard,
            includePath: customConfigProviderItem.includes,
            forcedInclude: customConfigProviderItem.forcedIncludes,
            intelliSenseMode: customConfigProviderItem.intelliSenseMode,
            compilerPath: customConfigProviderItem.compilerFullPath,
            compilerArgs: customConfigProviderItem.compilerArgs,
            windowsSdkVersion: customConfigProviderItem.windowsSDKVersion
        };
        // cummulativeBrowsePath incorporates all the files and the includes paths
        // of all the compiler invocations of the current configuration
        customConfigProviderItem.files.forEach(filePath => {
            let uri = vscode.Uri.file(filePath);
            let sourceFileConfigurationItem = {
                uri,
                configuration,
                compileCommand: {
                    command: customConfigProviderItem.line,
                    directory: customConfigProviderItem.currentPath,
                    file: filePath
                }
            };
            // These are the configurations processed during the current configure.
            // Store them in the 'delta' file index instead of the final one.
            provider.fileIndex.set(path.normalize((process.platform === "win32") ? uri.fsPath.toUpperCase() : uri.fsPath), sourceFileConfigurationItem);
            exports.extension.getCppConfigurationProvider().logConfigurationProviderItem(sourceFileConfigurationItem);
            let folder = path.dirname(filePath);
            if (!this.cummulativeBrowsePath.includes(folder)) {
                this.cummulativeBrowsePath.push(folder);
            }
        });
        customConfigProviderItem.includes.forEach(incl => {
            if (!this.cummulativeBrowsePath.includes(incl)) {
                this.cummulativeBrowsePath.push(incl);
            }
        });
        customConfigProviderItem.forcedIncludes.forEach(fincl => {
            let folder = path.dirname(fincl);
            if (!this.cummulativeBrowsePath.includes(folder)) {
                this.cummulativeBrowsePath.push(fincl);
            }
        });
        provider.workspaceBrowse = {
            browsePath: this.cummulativeBrowsePath,
            standard: customConfigProviderItem.standard,
            compilerPath: customConfigProviderItem.compilerFullPath,
            compilerArgs: customConfigProviderItem.compilerArgs,
            windowsSdkVersion: customConfigProviderItem.windowsSDKVersion
        };
        make.setCustomConfigurationProvider(provider);
    }
    getCompilerFullPath() { return this.compilerFullPath; }
}
exports.MakefileToolsExtension = MakefileToolsExtension;
async function activate(context) {
    statusBar = ui.getUI();
    exports.extension = new MakefileToolsExtension(context);
    configuration.disableAllOptionallyVisibleCommands();
    await exports.extension.setFullFeatureSet(false);
    telemetry.activate();
    context.subscriptions.push(vscode.commands.registerCommand('makefile.setBuildConfiguration', async () => {
        await configuration.setNewConfiguration();
    }));
    context.subscriptions.push(vscode.commands.registerCommand('makefile.getConfiguration', async () => {
        telemetry.logEvent("getConfiguration");
        return configuration.getCurrentMakefileConfiguration();
    }));
    context.subscriptions.push(vscode.commands.registerCommand('makefile.setBuildTarget', async () => {
        await configuration.selectTarget();
    }));
    context.subscriptions.push(vscode.commands.registerCommand('makefile.getBuildTarget', async () => {
        telemetry.logEvent("getBuildTarget");
        return configuration.getCurrentTarget() || "";
    }));
    context.subscriptions.push(vscode.commands.registerCommand('makefile.buildTarget', async () => {
        await make.buildTarget(make.TriggeredBy.buildTarget, configuration.getCurrentTarget() || "", false);
    }));
    context.subscriptions.push(vscode.commands.registerCommand('makefile.buildCleanTarget', async () => {
        await make.buildTarget(make.TriggeredBy.buildCleanTarget, configuration.getCurrentTarget() || "", true);
    }));
    context.subscriptions.push(vscode.commands.registerCommand('makefile.buildAll', async () => {
        await make.buildTarget(make.TriggeredBy.buildAll, "all", false);
    }));
    context.subscriptions.push(vscode.commands.registerCommand('makefile.buildCleanAll', async () => {
        await make.buildTarget(make.TriggeredBy.buildCleanAll, "all", true);
    }));
    context.subscriptions.push(vscode.commands.registerCommand('makefile.setLaunchConfiguration', async () => {
        await configuration.selectLaunchConfiguration();
    }));
    context.subscriptions.push(vscode.commands.registerCommand('makefile.launchDebug', async () => {
        await launcher.debugCurrentTarget();
    }));
    context.subscriptions.push(vscode.commands.registerCommand('makefile.launchRun', async () => {
        await launcher.runCurrentTarget();
    }));
    /** Start of commands that shouldn't be exposed in package.json, they are used for command substitution in launch.json and tasks.json.  */
    context.subscriptions.push(vscode.commands.registerCommand('makefile.getLaunchTargetPath', () => {
        telemetry.logEvent("getLaunchTargetPath");
        return launcher.getLaunchTargetPath();
    }));
    context.subscriptions.push(vscode.commands.registerCommand('makefile.launchTargetPath', () => {
        telemetry.logEvent("launchTargetPath");
        return launcher.launchTargetPath();
    }));
    context.subscriptions.push(vscode.commands.registerCommand('makefile.getLaunchTargetDirectory', () => {
        telemetry.logEvent("getLaunchTargetDirectory");
        return launcher.getLaunchTargetDirectory();
    }));
    context.subscriptions.push(vscode.commands.registerCommand('makefile.getLaunchTargetFileName', () => {
        telemetry.logEvent("getLaunchTargetFileName");
        return launcher.getLaunchTargetFileName();
    }));
    context.subscriptions.push(vscode.commands.registerCommand('makefile.launchTargetFileName', () => {
        telemetry.logEvent("launchTargetFileName");
        return launcher.launchTargetFileName();
    }));
    context.subscriptions.push(vscode.commands.registerCommand('makefile.getLaunchTargetArgs', () => {
        telemetry.logEvent("getLaunchTargetArgs");
        return launcher.getLaunchTargetArgs();
    }));
    context.subscriptions.push(vscode.commands.registerCommand('makefile.getLaunchTargetArgsConcat', () => {
        telemetry.logEvent("getLaunchTargetArgsConcat");
        return launcher.getLaunchTargetArgsConcat();
    }));
    context.subscriptions.push(vscode.commands.registerCommand('makefile.makeBaseDirectory', () => {
        telemetry.logEvent("makeBaseDirectory");
        return configuration.makeBaseDirectory();
    }));
    /** End of commands that shouldn't be exposed in package.json, they are used for command substitution in launch.json and tasks.json. */
    context.subscriptions.push(vscode.commands.registerCommand('makefile.configure', async () => {
        await make.configure(make.TriggeredBy.configure);
    }));
    context.subscriptions.push(vscode.commands.registerCommand('makefile.cleanConfigure', async () => {
        await make.cleanConfigure(make.TriggeredBy.cleanConfigure);
    }));
    context.subscriptions.push(vscode.commands.registerCommand('makefile.preConfigure', async () => {
        await make.preConfigure(make.TriggeredBy.preconfigure);
    }));
    // Reset state - useful for troubleshooting.
    context.subscriptions.push(vscode.commands.registerCommand('makefile.resetState', () => {
        telemetry.logEvent("commandResetState");
        exports.extension.getState().reset();
    }));
    context.subscriptions.push(vscode.commands.registerCommand('makefile.outline.configure', () => {
        return vscode.commands.executeCommand("makefile.configure");
    }));
    context.subscriptions.push(vscode.commands.registerCommand('makefile.outline.cleanConfigure', () => {
        return vscode.commands.executeCommand("makefile.cleanConfigure");
    }));
    context.subscriptions.push(vscode.commands.registerCommand('makefile.outline.preConfigure', () => {
        return vscode.commands.executeCommand("makefile.preConfigure");
    }));
    context.subscriptions.push(vscode.commands.registerCommand('makefile.outline.setLaunchConfiguration', () => {
        return vscode.commands.executeCommand("makefile.setLaunchConfiguration");
    }));
    context.subscriptions.push(vscode.commands.registerCommand('makefile.outline.launchDebug', () => {
        return vscode.commands.executeCommand("makefile.launchDebug");
    }));
    context.subscriptions.push(vscode.commands.registerCommand('makefile.outline.launchRun', () => {
        return vscode.commands.executeCommand("makefile.launchRun");
    }));
    context.subscriptions.push(vscode.commands.registerCommand('makefile.outline.setBuildTarget', () => {
        return vscode.commands.executeCommand("makefile.setBuildTarget");
    }));
    context.subscriptions.push(vscode.commands.registerCommand('makefile.outline.buildTarget', () => {
        return vscode.commands.executeCommand("makefile.buildTarget");
    }));
    context.subscriptions.push(vscode.commands.registerCommand('makefile.outline.buildCleanTarget', () => {
        return vscode.commands.executeCommand("makefile.buildCleanTarget");
    }));
    context.subscriptions.push(vscode.commands.registerCommand('makefile.outline.setBuildConfiguration', () => {
        return vscode.commands.executeCommand("makefile.setBuildConfiguration");
    }));
    // Read from the workspace state before reading from settings,
    // becase the latter may use state info in variable expansion.
    configuration.initFromState();
    await configuration.initFromSettings(true);
    // Delete the script that is created by this extension in the temporary folder
    // with the purpose of spliting a compilation command fragment into switch arguments
    // as the shell sees them. See more about this script in parser.ts, parseAnySwitchFromToolArguments.
    // We need to delete this file occasionally to ensure that the extension will not use indefinitely
    // an eventual old version, especially because for performance reasons we don't create this file
    // every time we use it (the configure process creates it every time it's not found on disk).
    // Deleting this script here ensures that every new VSCode instance will operate on up to date script functionality.
    let parseCompilerArgsScript = util.parseCompilerArgsScriptFile();
    if (util.checkFileExistsSync(parseCompilerArgsScript)) {
        util.deleteFileSync(parseCompilerArgsScript);
    }
    if (configuration.getConfigureOnOpen() && exports.extension.getFullFeatureSet()) {
        // Always clean configure on open
        await make.cleanConfigure(make.TriggeredBy.cleanConfigureOnOpen);
    }
    // Analyze settings for type validation and telemetry
    let workspaceConfiguration = vscode.workspace.getConfiguration("makefile");
    let telemetryProperties = {};
    try {
        telemetryProperties = await telemetry.analyzeSettings(workspaceConfiguration, "makefile", util.thisExtensionPackage().contributes.configuration.properties, true, telemetryProperties);
    }
    catch (e) {
        telemetry.telemetryLogger(e.message);
    }
    if (telemetryProperties && util.hasProperties(telemetryProperties)) {
        telemetry.logEvent("settings", telemetryProperties);
    }
}
exports.activate = activate;
async function deactivate() {
    vscode.window.showInformationMessage(localize(0, null, "'vscode-makefile-tools'"));
    await telemetry.deactivate();
    const items = [
        exports.extension,
        launcher,
        statusBar
    ];
    for (const item of items) {
        if (item) {
            item.dispose();
        }
    }
}
exports.deactivate = deactivate;
