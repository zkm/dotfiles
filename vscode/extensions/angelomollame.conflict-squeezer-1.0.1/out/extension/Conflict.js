"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Constants_1 = require("./Constants");
class Conflict {
    constructor() {
        this.hasOriginal = false;
        this.textAfterMarkerOurs = undefined;
        this.textAfterMarkerOriginal = undefined;
        this.textAfterMarkerTheirs = undefined;
        this.textAfterMarkerEnd = undefined;
        this.ourLines = [];
        this.originalLines = [];
        this.theirLines = [];
    }
    getSqueezedText() {
        const minNumberOfLines = Math.min(this.ourLines.length, this.theirLines.length);
        const maxNumberOfLines = Math.max(this.ourLines.length, this.theirLines.length);
        // Top cursor will contain the number of identical lines from the top.
        // Bottom cursor will contain the number of identical lines from the bottom.
        let topCursor = 0;
        let bottomCursor = 0;
        while (topCursor < minNumberOfLines) {
            const ourLine = this.ourLines[topCursor];
            const theirLine = this.theirLines[topCursor];
            if (ourLine === theirLine) {
                topCursor++;
            }
            else {
                break;
            }
        }
        // We need to subtract topCursor, to ensure that topCursor + bottomCursor <= minNumberOfLines
        while (bottomCursor < minNumberOfLines - topCursor) {
            const ourLine = this.ourLines[this.ourLines.length - 1 - bottomCursor];
            const theirLine = this.theirLines[this.theirLines.length - 1 - bottomCursor];
            if (ourLine === theirLine) {
                bottomCursor++;
            }
            else {
                break;
            }
        }
        const identicalTopLines = this.ourLines.slice(0, topCursor);
        const identicalBottomLines = this.ourLines.slice(this.ourLines.length - bottomCursor, this.ourLines.length);
        let parts;
        if (topCursor + bottomCursor === maxNumberOfLines) {
            parts = [
                ...identicalTopLines,
                ...identicalBottomLines
            ];
        }
        else {
            const ourNonIdenticalLines = this.ourLines.slice(topCursor, this.ourLines.length - bottomCursor);
            const theirNonIdenticalLines = this.theirLines.slice(topCursor, this.theirLines.length - bottomCursor);
            let originalParts;
            if (this.hasOriginal) {
                originalParts = [
                    Constants_1.Constants.conflictMarkerOriginal + this.textAfterMarkerOriginal,
                    ...this.originalLines
                ];
            }
            else {
                originalParts = [];
            }
            parts = [
                ...identicalTopLines,
                Constants_1.Constants.conflictMarkerOurs + this.textAfterMarkerOurs,
                ...ourNonIdenticalLines,
                ...originalParts,
                Constants_1.Constants.conflictMarkerTheirs + this.textAfterMarkerTheirs,
                ...theirNonIdenticalLines,
                Constants_1.Constants.conflictMarkerEnd + this.textAfterMarkerEnd,
                ...identicalBottomLines
            ];
        }
        return parts.filter(part => part.length > 0).join("");
    }
    addOriginalLine(line) {
        this.originalLines.push(line);
    }
    addOurLine(line) {
        this.ourLines.push(line);
    }
    addTheirLine(line) {
        this.theirLines.push(line);
    }
    setTextAfterMarkerEnd(text) {
        this.textAfterMarkerEnd = text;
    }
    setTextAfterMarkerOriginal(text) {
        this.textAfterMarkerOriginal = text;
    }
    setTextAfterMarkerOurs(text) {
        this.textAfterMarkerOurs = text;
    }
    setTextAfterMarkerTheirs(text) {
        this.textAfterMarkerTheirs = text;
    }
}
exports.Conflict = Conflict;
//# sourceMappingURL=Conflict.js.map