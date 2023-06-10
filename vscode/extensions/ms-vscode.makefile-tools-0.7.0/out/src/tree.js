"use strict";
// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProjectOutlineProvider = exports.BuildLogPathInfoNode = exports.MakePathInfoNode = exports.MakefilePathInfoNode = exports.ConfigurationNode = exports.LaunchTargetNode = exports.BuildTargetNode = void 0;
// Tree.ts
const configuration = require("./configuration");
const path = require("path");
const util = require("./util");
const vscode = require("vscode");
const nls = require("vscode-nls");
nls.config({ messageFormat: nls.MessageFormat.bundle, bundleFormat: nls.BundleFormat.standalone })(__filename);
const localize = nls.loadMessageBundle(__filename);
class BaseNode {
    constructor(id) {
        this.id = id;
    }
}
class BuildTargetNode extends BaseNode {
    constructor(targetName) {
        super(`buildTarget:${targetName}`);
        this._name = targetName;
    }
    update(targetName) {
        this._name = localize(0, null, `[${targetName}]`);
    }
    getChildren() {
        return [];
    }
    getTreeItem() {
        try {
            const item = new vscode.TreeItem(this._name);
            item.collapsibleState = vscode.TreeItemCollapsibleState.None;
            item.tooltip = localize(1, null);
            item.contextValue = [
                `nodeType=buildTarget`,
            ].join(',');
            return item;
        }
        catch (e) {
            return new vscode.TreeItem(localize(2, null, this._name));
        }
    }
}
exports.BuildTargetNode = BuildTargetNode;
class LaunchTargetNode extends BaseNode {
    // Keep the tree node label as short as possible.
    // The binary path is the most important component of a launch target.
    async getShortLaunchTargetName(completeLaunchTargetName) {
        let launchConfiguration = await configuration.stringToLaunchConfiguration(completeLaunchTargetName);
        let shortName;
        if (!launchConfiguration) {
            shortName = "Unset";
        }
        else {
            if (vscode.workspace.workspaceFolders) {
                // In a complete launch target string, the binary path is relative to cwd.
                // In here, since we don't show cwd, make it relative to current workspace folder.
                shortName = util.makeRelPath(launchConfiguration.binaryPath, vscode.workspace.workspaceFolders[0].uri.fsPath);
            }
            else {
                // Just in case, if for some reason we don't have a workspace folder, return full binary path.
                shortName = launchConfiguration.binaryPath;
            }
        }
        return localize(3, null, `[${shortName}]`);
    }
    constructor(targetName) {
        super(`launchTarget:${targetName}`);
        // Show the complete launch target name as tooltip and the short name as label
        this._name = targetName;
        this._toolTip = targetName;
    }
    async update(targetName) {
        // Show the complete launch target name as tooltip and the short name as label
        this._name = await this.getShortLaunchTargetName(targetName);
        this._toolTip = targetName;
    }
    getChildren() {
        return [];
    }
    getTreeItem() {
        try {
            const item = new vscode.TreeItem(this._name);
            item.collapsibleState = vscode.TreeItemCollapsibleState.None;
            item.tooltip = localize(4, null, this._toolTip);
            // enablement in makefile.outline.setLaunchConfiguration is not
            // disabling this TreeItem
            item.command = {
                command: "makefile.outline.setLaunchConfiguration",
                title: "%makefile-tools.command.makefile.setLaunchConfiguration.title%"
            };
            item.contextValue = [
                `nodeType=launchTarget`,
            ].join(',');
            return item;
        }
        catch (e) {
            return new vscode.TreeItem(localize(5, null, this._name));
        }
    }
}
exports.LaunchTargetNode = LaunchTargetNode;
class ConfigurationNode extends BaseNode {
    constructor(configurationName) {
        super(`configuration:${configurationName}`);
        this._name = configurationName;
    }
    update(configurationName) {
        this._name = localize(6, null, `[${configurationName}]`);
    }
    getChildren() {
        return [];
    }
    getTreeItem() {
        try {
            const item = new vscode.TreeItem(this._name);
            item.collapsibleState = vscode.TreeItemCollapsibleState.None;
            item.tooltip = "The makefile configuration currently selected from settings ('makefile.configurations').";
            item.contextValue = [
                `nodeType=configuration`,
            ].join(',');
            return item;
        }
        catch (e) {
            return new vscode.TreeItem(localize(7, null, this._name));
        }
    }
}
exports.ConfigurationNode = ConfigurationNode;
class MakefilePathInfoNode extends BaseNode {
    constructor(pathInSettings, pathDisplayed) {
        super(pathDisplayed);
        this._title = pathDisplayed;
        this._tooltip = pathInSettings;
    }
    update(pathInSettings, pathDisplayed) {
        this._title = localize(8, null, `${pathDisplayed}`);
        this._tooltip = pathInSettings;
    }
    getChildren() {
        return [];
    }
    getTreeItem() {
        try {
            const item = new vscode.TreeItem(this._title);
            item.collapsibleState = vscode.TreeItemCollapsibleState.None;
            item.tooltip = this._tooltip;
            item.contextValue = [
                `nodeType=makefilePathInfo`,
            ].join(',');
            return item;
        }
        catch (e) {
            return new vscode.TreeItem(localize(9, null, this._title));
        }
    }
}
exports.MakefilePathInfoNode = MakefilePathInfoNode;
class MakePathInfoNode extends BaseNode {
    constructor(pathInSettings, pathDisplayed) {
        super(pathDisplayed);
        this._title = pathDisplayed;
        this._tooltip = pathInSettings;
    }
    update(pathInSettings, pathDisplayed) {
        this._title = localize(10, null, `${pathDisplayed}`);
        this._tooltip = pathInSettings;
    }
    getChildren() {
        return [];
    }
    getTreeItem() {
        try {
            const item = new vscode.TreeItem(this._title);
            item.collapsibleState = vscode.TreeItemCollapsibleState.None;
            item.tooltip = this._tooltip;
            item.contextValue = [
                `nodeType=makePathInfo`,
            ].join(',');
            return item;
        }
        catch (e) {
            return new vscode.TreeItem(localize(11, null, this._title));
        }
    }
}
exports.MakePathInfoNode = MakePathInfoNode;
class BuildLogPathInfoNode extends BaseNode {
    constructor(pathInSettings, pathDisplayed) {
        super(pathDisplayed);
        this._title = pathDisplayed;
        this._tooltip = pathInSettings;
    }
    update(pathInSettings, pathDisplayed) {
        this._title = localize(12, null, `${pathDisplayed}`);
        this._tooltip = pathInSettings;
    }
    getChildren() {
        return [];
    }
    getTreeItem() {
        try {
            const item = new vscode.TreeItem(this._title);
            item.collapsibleState = vscode.TreeItemCollapsibleState.None;
            item.tooltip = this._tooltip;
            item.contextValue = [
                `nodeType=buildLogPathInfo`,
            ].join(',');
            return item;
        }
        catch (e) {
            return new vscode.TreeItem(localize(13, null, this._title));
        }
    }
}
exports.BuildLogPathInfoNode = BuildLogPathInfoNode;
class ProjectOutlineProvider {
    constructor() {
        this._changeEvent = new vscode.EventEmitter();
        this._unsetString = localize(14, null);
        this._currentConfigurationItem = new ConfigurationNode(this._unsetString);
        this._currentBuildTargetItem = new BuildTargetNode(this._unsetString);
        this._currentLaunchTargetItem = new LaunchTargetNode(this._unsetString);
        this._currentMakefilePathInfoItem = new MakefilePathInfoNode(this._unsetString, "");
        this._currentMakePathInfoItem = new MakePathInfoNode(this._unsetString, "");
        this._currentBuildLogPathInfoItem = new BuildLogPathInfoNode(this._unsetString, "");
    }
    get onDidChangeTreeData() {
        return this._changeEvent.event;
    }
    async getTreeItem(node) {
        return node.getTreeItem();
    }
    getChildren(node) {
        if (node) {
            return node.getChildren();
        }
        if (configuration.isOptionalFeatureEnabled("debug") || configuration.isOptionalFeatureEnabled("run")) {
            return [this._currentConfigurationItem,
                this._currentBuildTargetItem,
                this._currentLaunchTargetItem,
                this._currentMakefilePathInfoItem,
                this._currentMakePathInfoItem,
                this._currentBuildLogPathInfoItem];
        }
        else {
            return [this._currentConfigurationItem,
                this._currentBuildTargetItem,
                this._currentMakefilePathInfoItem,
                this._currentMakePathInfoItem,
                this._currentBuildLogPathInfoItem];
        }
    }
    pathDisplayed(pathInSettings, kind, searchInPath, makeRelative) {
        if (!pathInSettings) {
            return `${kind}: [Unset]`;
        }
        const pathInSettingsToTest = process.platform === "win32" && !(pathInSettings === null || pathInSettings === void 0 ? void 0 : pathInSettings.endsWith(".exe")) && kind === "Make" ? pathInSettings === null || pathInSettings === void 0 ? void 0 : pathInSettings.concat(".exe") : pathInSettings;
        const pathBase = (searchInPath && path.parse(pathInSettingsToTest).dir === "") ? path.parse(pathInSettingsToTest).base : undefined;
        const pathInEnv = pathBase ? (path.join(util.toolPathInEnv(pathBase) || "", pathBase)) : undefined;
        const finalPath = pathInEnv || pathInSettingsToTest;
        return (!util.checkFileExistsSync(finalPath) ? `${kind} (not found)` : `${kind}`) + `: [${makeRelative ? util.makeRelPath(finalPath, util.getWorkspaceRoot()) : finalPath}]`;
    }
    async update(configuration, buildTarget, launchTarget, makefilePathInfo, makePathInfo, buildLogInfo) {
        this._currentConfigurationItem.update(configuration || this._unsetString);
        this._currentBuildTargetItem.update(buildTarget || this._unsetString);
        await this._currentLaunchTargetItem.update(launchTarget || this._unsetString);
        this._currentMakefilePathInfoItem.update(makefilePathInfo || this._unsetString, this.pathDisplayed(makefilePathInfo, "Makefile", false, true));
        this._currentMakePathInfoItem.update(makePathInfo || this._unsetString, this.pathDisplayed(makePathInfo, "Make", true, false));
        this._currentBuildLogPathInfoItem.update(buildLogInfo || this._unsetString, this.pathDisplayed(buildLogInfo, "Build Log", false, true));
        this.updateTree();
    }
    updateConfiguration(configuration) {
        this._currentConfigurationItem.update(configuration);
        this.updateTree();
    }
    updateBuildTarget(buildTarget) {
        this._currentBuildTargetItem.update(buildTarget);
        this.updateTree();
    }
    async updateLaunchTarget(launchTarget) {
        await this._currentLaunchTargetItem.update(launchTarget);
        this.updateTree();
    }
    async updateMakefilePathInfo(makefilePathInfo) {
        this._currentMakefilePathInfoItem.update(makefilePathInfo || this._unsetString, this.pathDisplayed(makefilePathInfo, "Makefile", false, true));
        this.updateTree();
    }
    async updateMakePathInfo(makePathInfo) {
        this._currentMakePathInfoItem.update(makePathInfo || this._unsetString, this.pathDisplayed(makePathInfo, "Make", true, false));
        this.updateTree();
    }
    async updateBuildLogPathInfo(buildLogPathInfo) {
        this._currentBuildLogPathInfoItem.update(buildLogPathInfo || this._unsetString, this.pathDisplayed(buildLogPathInfo, "Build Log", false, true));
        this.updateTree();
    }
    updateTree() {
        this._changeEvent.fire(null);
    }
}
exports.ProjectOutlineProvider = ProjectOutlineProvider;
