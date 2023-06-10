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
Object.defineProperty(exports, "__esModule", { value: true });
const config_1 = require("./domain/config");
// @ts-check
const cp = require("child_process");
const vscode = require("vscode");
const walker = require("walker");
const path = require("path");
const fs_1 = require("fs");
const dirList_1 = require("./domain/dirList");
class ProjectLocator {
    constructor(config) {
        this.dirList = new dirList_1.default();
        this.config = config || new config_1.default();
    }
    /**
     * Returns the depth of the directory path
     *
     * @param {String} s The path to be processed
     * @returns Number
     */
    getPathDepth(s) {
        return s.split(path.sep).length;
    }
    isMaxDeptReached(currentDepth, initialDepth) {
        return (this.config.maxDepthRecursion > 0) && ((currentDepth - initialDepth) > this.config.maxDepthRecursion);
    }
    isFolderIgnored(folder) {
        return this.config.ignoredFolders.indexOf(folder) !== -1;
    }
    /**
     * Returs true if the *directory* param refers to a folder that is nested to an already found project and
     * _gitProjectManager.searchInsideProjects_ is true
     *
     * @param {string} directory
     */
    isNestedIgnoredFolder(directory) {
        return !this.config.searchInsideProjects && this.dirList.directories.some(dir => directory.includes(dir));
    }
    checkFolderExists(folderPath) {
        const exists = (0, fs_1.existsSync)(folderPath);
        if (!exists && this.config.warnIfFolderNotFound) {
            vscode.window.showWarningMessage(`Directory ${folderPath} does not exists.`);
        }
        return exists;
    }
    filterDir(dir, depth) {
        if (this.isFolderIgnored(path.basename(dir))) {
            return false;
        }
        ;
        if (this.isMaxDeptReached(this.getPathDepth(dir), depth)) {
            return false;
        }
        ;
        if (this.isNestedIgnoredFolder(dir)) {
            return false;
        }
        ;
        return true;
    }
    walkDirectory(dir) {
        var depth = this.getPathDepth(dir);
        return new Promise((resolve, reject) => {
            try {
                walker(dir)
                    .filterDir((dir) => this.filterDir(dir, depth))
                    .on('dir', (absPath) => this.processDirectory(absPath))
                    .on('symlink', (absPath) => this.processDirectory(absPath))
                    .on('error', (e) => this.handleError(e))
                    .on('end', () => {
                    resolve(this.dirList);
                });
            }
            catch (error) {
                reject(error);
            }
        });
    }
    locateGitProjects(projectsDirList) {
        return __awaiter(this, void 0, void 0, function* () {
            /** @type {string[]} */
            var promises = [];
            projectsDirList.forEach((projectBasePath) => {
                if (!this.checkFolderExists(projectBasePath)) {
                    return;
                }
                promises.push(this.walkDirectory(projectBasePath));
            });
            yield Promise.all(promises);
            return this.dirList;
        });
    }
    ;
    clearDirList() {
        this.dirList = new dirList_1.default();
    }
    ;
    extractRepoInfo(basePath) {
        var _a, _b, _c;
        if (!this.config.checkRemoteOrigin) {
            return;
        }
        let originList = cp.execSync('git remote ', { cwd: basePath, encoding: 'utf8' });
        let firstOrigin = (_a = originList === null || originList === void 0 ? void 0 : originList.split('\n').shift()) === null || _a === void 0 ? void 0 : _a.trim();
        if (firstOrigin === '') {
            return;
        }
        return (_c = (_b = cp.execSync(`git remote get-url ${firstOrigin}`, { cwd: basePath, encoding: 'utf8' })) === null || _b === void 0 ? void 0 : _b.split('\n').shift()) === null || _c === void 0 ? void 0 : _c.trim();
    }
    processDirectory(absPath) {
        vscode.window.setStatusBarMessage(absPath, 600);
        if ((0, fs_1.existsSync)(path.join(absPath, '.git', 'config'))) {
            this.dirList.add(absPath, this.extractRepoInfo(absPath));
        }
        else if (this.config.supportsMercurial && (0, fs_1.existsSync)(path.join(absPath, '.hg'))) {
            this.dirList.add(absPath, undefined);
        }
        else if (this.config.supportsSVN && (0, fs_1.existsSync)(path.join(absPath, '.svn'))) {
            this.dirList.add(absPath, undefined);
        }
    }
    handleError(err) {
        console.log('Error walker:', err);
    }
}
exports.default = ProjectLocator;
//# sourceMappingURL=gitProjectLocator.js.map