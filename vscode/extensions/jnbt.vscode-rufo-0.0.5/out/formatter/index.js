"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const edit_provider_1 = require("./edit_provider");
function registerFormatter(ctx, documentSelector) {
    new edit_provider_1.default().register(ctx, documentSelector);
}
exports.default = registerFormatter;
//# sourceMappingURL=index.js.map