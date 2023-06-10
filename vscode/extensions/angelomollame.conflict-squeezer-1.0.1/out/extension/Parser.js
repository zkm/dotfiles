"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Conflict_1 = require("./Conflict");
const ConflictSection_1 = require("./ConflictSection");
const Constants_1 = require("./Constants");
const StringUtils_1 = require("./StringUtils");
const TextSection_1 = require("./TextSection");
class Parser {
    static getLines(text) {
        const lines = [];
        const textLength = text.length;
        let currentCharacters = [];
        for (let i = 0; i < textLength; i++) {
            const character = text.charAt(i);
            if (character === "\n") {
                currentCharacters.push(character);
                lines.push(currentCharacters.join(""));
                currentCharacters = [];
            }
            else {
                if (i > 0 && text.charAt(i - 1) === "\r") {
                    lines.push(currentCharacters.join(""));
                    currentCharacters = [character];
                }
                else {
                    currentCharacters.push(character);
                }
            }
        }
        if (currentCharacters.length > 0) {
            lines.push(currentCharacters.join(""));
        }
        return lines;
    }
    static parse(text) {
        const sections = [];
        const lines = Parser.getLines(text);
        let state = 0 /* OutsideConflict */;
        let currentConflict = undefined;
        let currentTextLines = [];
        for (const line of lines) {
            const startsWithMarkerOursResult = StringUtils_1.StringUtils.startsWith(line, Constants_1.Constants.conflictMarkerOurs);
            const startsWithMarkerOriginalResult = StringUtils_1.StringUtils.startsWith(line, Constants_1.Constants.conflictMarkerOriginal);
            const startsWithMarkerTheirsResult = StringUtils_1.StringUtils.startsWith(line, Constants_1.Constants.conflictMarkerTheirs);
            const startsWithMarkerEndResult = StringUtils_1.StringUtils.startsWith(line, Constants_1.Constants.conflictMarkerEnd);
            if (startsWithMarkerOursResult.success) {
                if (state !== 0 /* OutsideConflict */) {
                    throw new Error("Unexpected conflict marker");
                }
                if (currentTextLines.length > 0) {
                    sections.push(new TextSection_1.TextSection(currentTextLines));
                    currentTextLines = [];
                }
                currentConflict = new Conflict_1.Conflict();
                currentConflict.setTextAfterMarkerOurs(startsWithMarkerOursResult.remainingText);
                state = 1 /* Ours */;
            }
            else if (startsWithMarkerOriginalResult.success) {
                if (state !== 1 /* Ours */) {
                    throw new Error("Unexpected conflict marker");
                }
                currentConflict.hasOriginal = true;
                currentConflict.setTextAfterMarkerOriginal(startsWithMarkerOriginalResult.remainingText);
                state = 2 /* Original */;
            }
            else if (startsWithMarkerTheirsResult.success) {
                if (state !== 1 /* Ours */ && state !== 2 /* Original */) {
                    throw new Error("Unexpected conflict marker");
                }
                currentConflict.setTextAfterMarkerTheirs(startsWithMarkerTheirsResult.remainingText);
                state = 3 /* Theirs */;
            }
            else if (startsWithMarkerEndResult.success) {
                if (state !== 3 /* Theirs */) {
                    throw new Error("Unexpected conflict marker");
                }
                currentConflict.setTextAfterMarkerEnd(startsWithMarkerEndResult.remainingText);
                sections.push(new ConflictSection_1.ConflictSection(currentConflict));
                currentConflict = undefined;
                state = 0 /* OutsideConflict */;
            }
            else {
                if (state === 0 /* OutsideConflict */) {
                    currentTextLines.push(line);
                }
                else if (state === 1 /* Ours */) {
                    currentConflict.addOurLine(line);
                }
                else if (state === 2 /* Original */) {
                    currentConflict.addOriginalLine(line);
                }
                else if (state === 3 /* Theirs */) {
                    currentConflict.addTheirLine(line);
                }
                else {
                    throw new Error("Unexpected state");
                }
            }
        }
        if (currentConflict) {
            throw new Error("Conflict still open");
        }
        if (currentTextLines.length > 0) {
            sections.push(new TextSection_1.TextSection(currentTextLines));
        }
        return sections;
    }
}
exports.Parser = Parser;
//# sourceMappingURL=Parser.js.map