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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getProjectHash = void 0;
const crypto_1 = __importDefault(require("crypto"));
const vscode_1 = require("vscode");
/**
 * Get a unique identifier for the project by hashing
 * the directory with `schema.prisma`
 */
function getProjectHash() {
    return __awaiter(this, void 0, void 0, function* () {
        let projectPath = yield getSchemaPath();
        projectPath = projectPath || process.cwd(); // Default to cwd if the schema couldn't be found
        console.log('projectPath: ' + projectPath);
        return crypto_1.default.createHash('sha256').update(projectPath).digest('hex').substring(0, 8);
    });
}
exports.getProjectHash = getProjectHash;
function getSchemaPath() {
    var _a;
    return __awaiter(this, void 0, void 0, function* () {
        // try the currently open document
        const schemaPath = (_a = vscode_1.window.activeTextEditor) === null || _a === void 0 ? void 0 : _a.document.fileName;
        if (schemaPath && schemaPath.endsWith('.prisma')) {
            return schemaPath;
        }
        // try the workspace
        const fileInWorkspace = yield vscode_1.workspace.findFiles('**/schema.prisma', '**/node_modules/**');
        if (fileInWorkspace.length !== 0) {
            return fileInWorkspace[0].toString();
        }
        return null;
    });
}
//# sourceMappingURL=hashes.js.map