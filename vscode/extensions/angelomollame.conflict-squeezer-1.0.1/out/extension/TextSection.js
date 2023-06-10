"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class TextSection {
    constructor(lines) {
        this.lines = [];
        this.lines = lines;
    }
    getText() {
        return this.lines.join("");
    }
}
exports.TextSection = TextSection;
//# sourceMappingURL=TextSection.js.map