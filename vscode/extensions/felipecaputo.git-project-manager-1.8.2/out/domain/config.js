"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * @typedef Config
 * @type {Object}
 * @property {number} maxDepthRecursion Define how deep locator will search
 * @class Config
 */
class Config extends Object {
    constructor(vscodeCfg) {
        super();
        this.maxDepthRecursion = 2;
        this.ignoredFolders = ['node_modules'];
        this.baseProjectFolders = [];
        this.storeRepositoriesBetweenSessions = false;
        this.checkRemoteOrigin = true;
        this.openInNewWindow = false;
        this.warnIfFolderNotFound = false;
        this.unversionedProjects = [];
        this.recentProjectListSize = 5;
        this.searchInsideProjects = true;
        this.supportsMercurial = false;
        this.supportsSVN = false;
        this.displayProjectPath = false;
        if (vscodeCfg) {
            this.loadConfigFromVsCode(vscodeCfg);
        }
    }
    loadConfigFromVsCode(vscodeConfig) {
        this.maxDepthRecursion = vscodeConfig.get('maxDepthRecursion', 2);
        this.ignoredFolders = vscodeConfig.get('ignoredFolders', []);
        this.baseProjectFolders = vscodeConfig.get('baseProjectsFolders', []);
        this.storeRepositoriesBetweenSessions = vscodeConfig.get('storeRepositoriesBetweenSessions', false);
        this.checkRemoteOrigin = vscodeConfig.get('checkRemoteOrigin', true);
        this.openInNewWindow = vscodeConfig.get('openInNewWindow') || false;
        this.warnIfFolderNotFound = vscodeConfig.get('warnIfFolderNotFound') || true;
        this.unversionedProjects = vscodeConfig.get('unversionedProjects', []);
        this.recentProjectListSize = vscodeConfig.get('recentProjectsListSize', 5);
        this.searchInsideProjects = vscodeConfig.get('searchInsideProjects', true);
        this.supportsMercurial = vscodeConfig.get('supportsMercurial', false);
        this.supportsSVN = vscodeConfig.get('supportsSVN', false);
        this.displayProjectPath = vscodeConfig.get('displayProjectPath', false);
    }
}
exports.default = Config;
//# sourceMappingURL=config.js.map