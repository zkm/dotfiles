"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const path = require("path");
class DirList {
    constructor() {
        this.dirs = [];
    }
    get dirList() {
        return this.dirs;
    }
    /**
     * Returns an array with all current directories
     *
     * @returns {[]string} An array that contains all directories
     * @readonly
     */
    get directories() {
        return this.dirs.map(x => x.directory);
    }
    concat(aDirList) {
        aDirList.dirList.forEach(e => this.add(e.directory, e.repository));
    }
    add(dirPath, repositoryName) {
        const dirName = path.basename(dirPath);
        if (this.exists(dirPath)) {
            return;
        }
        this.dirs.push({
            directory: dirPath,
            name: dirName,
            repository: repositoryName || 'not available'
        });
    }
    exists(dirPath) {
        return this.dirs.find(e => e.directory === dirPath) !== undefined;
    }
    clear() {
        this.dirs = [];
    }
}
exports.default = DirList;
//# sourceMappingURL=dirList.js.map