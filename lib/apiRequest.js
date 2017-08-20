"use strict";
/**
 * APIリクエストモジュール
 */
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const transporters_1 = require("./transporters");
/**
 * Create and send request to API
 */
function apiRequest(options) {
    return __awaiter(this, void 0, void 0, function* () {
        const expectedStatusCodes = options.expectedStatusCodes;
        delete options.expectedStatusCodes;
        const defaultOptions = {
            headers: {},
            qs: {},
            json: true,
            simple: false,
            resolveWithFullResponse: true,
            useQuerystring: true
        };
        options = Object.assign({}, defaultOptions, options);
        return yield (new transporters_1.DefaultTransporter(expectedStatusCodes)).request(options);
    });
}
exports.default = apiRequest;
