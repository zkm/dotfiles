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
exports.deactivate = exports.activate = void 0;
const plugins_1 = __importDefault(require("./plugins"));
function activate(context) {
    plugins_1.default.map((plugin) => __awaiter(this, void 0, void 0, function* () {
        const enabled = yield plugin.enabled();
        if (enabled) {
            console.log(`Activating ${plugin.name}`);
            if (plugin.activate) {
                yield plugin.activate(context);
            }
        }
        else {
            console.log(`${plugin.name} is Disabled`);
        }
    }));
}
exports.activate = activate;
function deactivate() {
    plugins_1.default.forEach((plugin) => {
        if (plugin.deactivate) {
            void plugin.deactivate();
        }
    });
}
exports.deactivate = deactivate;
//# sourceMappingURL=extension.js.map