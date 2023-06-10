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
/* eslint-disable @typescript-eslint/restrict-template-expressions, @typescript-eslint/no-misused-promises */
function testCompletion(docUri, position, expectedCompletionList, isActivated, triggerCharacter) {
    return __awaiter(this, void 0, void 0, function* () {
        if (!isActivated) {
            yield (0, helper_1.activate)(docUri);
        }
        const actualCompletions = (yield vscode_1.default.commands.executeCommand('vscode.executeCompletionItemProvider', docUri, position, triggerCharacter));
        assert_1.default.deepStrictEqual(actualCompletions.isIncomplete, expectedCompletionList.isIncomplete, `Line ${position.line} - Character ${position.character}
Expected isIncomplete to be '${expectedCompletionList.isIncomplete}' but got '${actualCompletions.isIncomplete}'
expected:
${JSON.stringify(expectedCompletionList, undefined, 2)}
but got (actual):
${JSON.stringify(actualCompletions, undefined, 2)}`);
        assert_1.default.deepStrictEqual(actualCompletions.items.map((items) => items.label), expectedCompletionList.items.map((items) => items.label), `Line ${position.line} - Character ${position.character}
mapped items => item.label`);
        assert_1.default.deepStrictEqual(actualCompletions.items.map((item) => item.kind), expectedCompletionList.items.map((item) => item.kind), `Line ${position.line} - Character ${position.character}
mapped items => item.kind`);
        assert_1.default.deepStrictEqual(actualCompletions.items.length, expectedCompletionList.items.length, `Line ${position.line} - Character ${position.character}
Expected ${expectedCompletionList.items.length} suggestions and got ${actualCompletions.items.length}: ${JSON.stringify(actualCompletions.items, undefined, 2)}`);
        assert_1.default.deepStrictEqual(actualCompletions.items.length, expectedCompletionList.items.length, `Line ${position.line} - Character ${position.character}
items.length`);
    });
}
const emptyDocUri = (0, helper_1.getDocUri)('completions/empty.prisma');
suite('Completions', () => {
    test('Diagnoses block type suggestions for empty file', () => __awaiter(void 0, void 0, void 0, function* () {
        yield testCompletion(emptyDocUri, new vscode_1.default.Position(0, 0), new vscode_1.default.CompletionList([
            { label: 'datasource', kind: vscode_1.default.CompletionItemKind.Class },
            { label: 'enum', kind: vscode_1.default.CompletionItemKind.Class },
            { label: 'generator', kind: vscode_1.default.CompletionItemKind.Class },
            { label: 'model', kind: vscode_1.default.CompletionItemKind.Class },
        ], false), false);
    }));
});
//# sourceMappingURL=completion.test.js.map