"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const RecentItem_1 = require("./domain/RecentItem");
class RecentItems {
    /**
     * Creates an instance of RecentItems.
     *
     * @param {Memento} state Global extension state.
     * @param {number} [listSize=5] Recent items list size.
     */
    constructor(state, listSize = 5) {
        this.state = state;
        this.listSize = listSize;
        this.list = this.state.get('recent', []);
    }
    addProject(projectPath, gitRepo) {
        const idx = this.list.findIndex(p => p.projectPath === projectPath);
        if (idx >= 0) {
            this.list[idx].lastUsed = new Date().getTime();
        }
        else {
            this.list.push(new RecentItem_1.default(projectPath, gitRepo, new Date().getTime()));
        }
        ;
        this.sortList();
        this.state.update('recent', this.list);
    }
    sortList() {
        this.list = this.list.sort((a, b) => b.lastUsed - a.lastUsed);
        if (this.list.length > this.listSize) {
            this.list = this.list.slice(0, this.listSize - 1);
        }
    }
}
exports.default = RecentItems;
//# sourceMappingURL=recentItems.js.map