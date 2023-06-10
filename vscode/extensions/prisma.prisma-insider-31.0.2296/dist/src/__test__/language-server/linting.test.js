"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const vscode = __importStar(require("vscode"));
const assert = __importStar(require("assert"));
const helper_1 = require("../helper");
function testDiagnostics(docUri, expectedDiagnostics) {
    return __awaiter(this, void 0, void 0, function* () {
        yield (0, helper_1.activate)(docUri);
        const actualDiagnostics = vscode.languages.getDiagnostics(docUri);
        assert.strictEqual(actualDiagnostics.length, expectedDiagnostics.length);
        expectedDiagnostics.forEach((expectedDiagnostic, i) => {
            const actualDiagnostic = actualDiagnostics[i];
            assert.strictEqual(actualDiagnostic.message, expectedDiagnostic.message);
            assert.deepStrictEqual(actualDiagnostic.range, expectedDiagnostic.range);
            assert.strictEqual(actualDiagnostic.severity, expectedDiagnostic.severity);
        });
    });
}
suite('Should get linting', () => {
    const docUri = (0, helper_1.getDocUri)('linting/missingArgument.prisma');
    test('Diagnoses missing argument', () => __awaiter(void 0, void 0, void 0, function* () {
        yield testDiagnostics(docUri, [
            {
                message: 'Argument "provider" is missing in data source block "db".',
                range: (0, helper_1.toRange)(0, 0, 2, 1),
                severity: vscode.DiagnosticSeverity.Error,
                source: '',
            },
        ]);
    }));
});
//# sourceMappingURL=linting.test.js.map