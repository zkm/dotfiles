"use strict";
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateListener = void 0;
const dispose_1 = require("./utils/dispose");
const vscode = require("vscode");
const constants_1 = require("./utils/constants");
const settingsUtil_1 = require("./utils/settingsUtil");
const pathUtil_1 = require("./utils/pathUtil");
/**
 * Listens for any file changes within:
 * - workspace files in any workspace
 * - files that are open
 */
class UpdateListener extends dispose_1.Disposable {
    constructor(_userDataDir) {
        super();
        this._shouldRefreshPreviews = this._register(new vscode.EventEmitter());
        this.shouldRefreshPreviews = this._shouldRefreshPreviews.event;
        this._watcher = vscode.workspace.createFileSystemWatcher('**');
        const notUserDataDirChange = function (file) {
            return (file.scheme != constants_1.UriSchemes.vscode_userdata &&
                (!_userDataDir || !pathUtil_1.PathUtil.PathBeginsWith(file.fsPath, _userDataDir)));
        };
        this._debounceDelay = settingsUtil_1.SettingUtil.GetConfig().previewDebounceDelay;
        this._register(vscode.workspace.onDidChangeTextDocument((e) => {
            if (e.contentChanges &&
                e.contentChanges.length > 0 &&
                (e.document.uri.scheme == constants_1.UriSchemes.file ||
                    e.document.uri.scheme == constants_1.UriSchemes.untitled) &&
                this._reloadOnAnyChange) {
                this._refreshPreview();
            }
        }));
        this._register(vscode.workspace.onDidSaveTextDocument((e) => {
            this._reloadIfOutOfWorkspace(e.uri);
        }));
        this._register(vscode.workspace.onDidCreateFiles((e) => {
            for (const file of e.files) {
                this._reloadIfOutOfWorkspace(file);
            }
        }));
        this._register(vscode.workspace.onDidDeleteFiles((e) => {
            for (const file of e.files) {
                this._reloadIfOutOfWorkspace(file);
            }
        }));
        this._register(this._watcher.onDidChange((e) => {
            if (this._reloadOnSave && notUserDataDirChange(e)) {
                this._refreshPreview();
            }
        }));
        this._register(this._watcher.onDidDelete((e) => {
            if ((this._reloadOnAnyChange || this._reloadOnSave) &&
                notUserDataDirChange(e)) {
                this._refreshPreview();
            }
        }));
        this._register(this._watcher.onDidCreate((e) => {
            if ((this._reloadOnAnyChange || this._reloadOnSave) &&
                notUserDataDirChange(e)) {
                this._refreshPreview();
            }
        }));
        this._register(vscode.workspace.onDidChangeConfiguration((e) => {
            this._debounceDelay =
                settingsUtil_1.SettingUtil.GetConfig().previewDebounceDelay;
        }));
    }
    /**
     * @description whether to reload on any change from the editor.
     */
    get _reloadOnAnyChange() {
        return (settingsUtil_1.SettingUtil.GetConfig().autoRefreshPreview ==
            settingsUtil_1.AutoRefreshPreview.onAnyChange);
    }
    /**
     * @description whether to reload on file save.
     */
    get _reloadOnSave() {
        return (settingsUtil_1.SettingUtil.GetConfig().autoRefreshPreview == settingsUtil_1.AutoRefreshPreview.onSave);
    }
    /**
     * Usually called if this._watcher would have also triggered. Makes sure it doesn't re-trigger a refresh if a refresh is already underway
     * @param uri
     */
    _reloadIfOutOfWorkspace(uri) {
        if (!pathUtil_1.PathUtil.GetWorkspaceFromURI(uri)) {
            this._refreshPreview();
        }
    }
    _refreshPreview() {
        clearTimeout(this._debounceTimer);
        this._debounceTimer = setTimeout(() => { this._shouldRefreshPreviews.fire(); }, this._debounceDelay);
    }
}
exports.UpdateListener = UpdateListener;
//# sourceMappingURL=updateListener.js.map