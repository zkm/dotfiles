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
const vscode_1 = __importDefault(require("vscode"));
const assert_1 = __importDefault(require("assert"));
const helper_1 = require("../helper");
function testJumpToDefinition(fixturePathSqlite, position, expectedLocation) {
    return __awaiter(this, void 0, void 0, function* () {
        const actualLocation = (yield vscode_1.default.commands.executeCommand('vscode.executeDefinitionProvider', fixturePathSqlite, position));
        assert_1.default.ok(actualLocation.length === 1);
        assert_1.default.deepStrictEqual(actualLocation[0].targetRange, expectedLocation.range);
    });
}
suite('Jump-to-definition', () => {
    const fixturePathSqlite = (0, helper_1.getDocUri)('jump-to-definition/schema.prisma');
    test('SQLite: from attribute to model', function () {
        return __awaiter(this, void 0, void 0, function* () {
            yield (0, helper_1.activate)(fixturePathSqlite);
            yield testJumpToDefinition(fixturePathSqlite, new vscode_1.default.Position(11, 16), new vscode_1.default.Location(fixturePathSqlite, (0, helper_1.toRange)(26, 0, 31, 1)));
        });
    });
});
//# sourceMappingURL=jumpToDefinition.test.js.map