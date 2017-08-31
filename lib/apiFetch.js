"use strict";
/**
 * API fetch module
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
const querystring = require("querystring");
const transporters_1 = require("./transporters");
/**
 * Create and send request to API
 */
function apiFetch(options) {
    return __awaiter(this, void 0, void 0, function* () {
        const defaultOptions = {
            headers: {},
            method: 'GET'
        };
        options = Object.assign({}, defaultOptions, options);
        let url = `${options.baseUrl}${options.uri}`;
        const querystrings = querystring.stringify(options.qs);
        url += (querystrings.length > 0) ? `?${querystrings}` : '';
        const headers = Object.assign({
            Accept: 'application/json',
            'Content-Type': 'application/json'
        }, options.headers);
        const fetchOptions = {
            method: options.method,
            headers: headers,
            body: JSON.stringify(options.body)
        };
        // create request (using authClient or otherwise and return request obj)
        if (options.auth !== undefined) {
            return yield options.auth.fetch(url, fetchOptions, options.expectedStatusCodes);
        }
        else {
            return yield (new transporters_1.DefaultTransporter(options.expectedStatusCodes)).fetch(url, fetchOptions);
        }
    });
}
exports.default = apiFetch;
