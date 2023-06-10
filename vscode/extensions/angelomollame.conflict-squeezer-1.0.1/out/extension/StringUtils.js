"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class StringUtils {
    static startsWith(thisText, otherText) {
        if (thisText.startsWith(otherText)) {
            return {
                success: true,
                remainingText: thisText.substr(otherText.length)
            };
        }
        return {
            success: false
        };
    }
}
exports.StringUtils = StringUtils;
//# sourceMappingURL=StringUtils.js.map