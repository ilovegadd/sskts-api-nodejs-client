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
function apiRequest(params) {
    return __awaiter(this, void 0, void 0, function* () {
        const expectedStatusCodes = params.expectedStatusCodes;
        const authClient = params.auth;
        const defaultOptions = {
            headers: {},
            qs: {},
            json: true,
            simple: false,
            resolveWithFullResponse: true,
            useQuerystring: true
        };
        const options = Object.assign({}, defaultOptions, {
            uri: params.uri,
            baseUrl: params.baseUrl,
            form: params.form,
            qs: params.qs,
            method: params.method,
            headers: params.headers,
            body: params.body
        });
        // create request (using authClient or otherwise and return request obj)
        if (authClient !== undefined) {
            return yield authClient.request(options, expectedStatusCodes);
        }
        else {
            return yield (new transporters_1.DefaultTransporter(expectedStatusCodes)).request(options);
        }
    });
}
exports.default = apiRequest;
