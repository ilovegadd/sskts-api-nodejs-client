"use strict";
/**
 * transporters
 *
 * @ignore
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
const createDebug = require("debug");
const httpStatus = require("http-status");
const fetch = require("isomorphic-fetch");
const debug = createDebug('sasaki-api:transporters');
// tslint:disable-next-line
const pkg = require('../package.json');
/**
 * RequestError
 */
class RequestError extends Error {
}
exports.RequestError = RequestError;
/**
 * DefaultTransporter
 */
class DefaultTransporter {
    constructor(expectedStatusCodes) {
        this.expectedStatusCodes = expectedStatusCodes;
    }
    /**
     * Configures request options before making a request.
     */
    static CONFIGURE(options) {
        // set transporter user agent
        options.headers = (options.headers !== undefined) ? options.headers : {};
        if (!options.headers['User-Agent']) {
            options.headers['User-Agent'] = DefaultTransporter.USER_AGENT;
        }
        else if (options.headers['User-Agent'].indexOf(DefaultTransporter.USER_AGENT) === -1) {
            options.headers['User-Agent'] = `${options.headers['User-Agent']} ${DefaultTransporter.USER_AGENT}`;
        }
        return options;
    }
    /**
     * Makes a request with given options and invokes callback.
     */
    fetch(url, options) {
        return __awaiter(this, void 0, void 0, function* () {
            const fetchOptions = DefaultTransporter.CONFIGURE(options);
            debug('fetching...', fetchOptions);
            return yield fetch(url, fetchOptions).then((response) => __awaiter(this, void 0, void 0, function* () { return this.wrapCallback(response); }));
        });
    }
    /**
     * Wraps the response callback.
     */
    wrapCallback(response) {
        return __awaiter(this, void 0, void 0, function* () {
            let err = new RequestError('An unexpected error occurred');
            debug('request processed', response.status);
            if (this.expectedStatusCodes.indexOf(response.status) < 0) {
                // Consider all 4xx and 5xx responses errors.
                let body;
                try {
                    // Only and only application/json responses should
                    // be decoded back to JSON, but there are cases API back-ends
                    // responds without proper content-type.
                    body = yield response.json();
                }
                catch (error) {
                    body = yield response.text();
                }
                if (typeof body === 'object' && body.error !== undefined) {
                    err = new RequestError(body.error.message);
                    err.code = response.status;
                    err.errors = body.error.errors;
                }
                else {
                    err = new RequestError(body);
                    err.code = response.status;
                    err.errors = [];
                }
            }
            else {
                if (response.status === httpStatus.NO_CONTENT) {
                    // consider 204
                    return;
                }
                else {
                    const body = yield response.json();
                    if (body !== undefined && body.data !== undefined) {
                        // consider 200,201,404
                        return body.data;
                    }
                }
            }
            throw err;
        });
    }
}
/**
 * Default user agent.
 */
DefaultTransporter.USER_AGENT = `sasaki-api-nodejs-client/${pkg.version}`;
exports.DefaultTransporter = DefaultTransporter;
/**
 * TransporterWithRequestPromise
 */
// export class TransporterWithRequestPromise {
//     /**
//      * Default user agent.
//      */
//     public static readonly USER_AGENT: string = `sasaki-api-nodejs-client/${pkg.version}`;
//     public expectedStatusCodes: number[];
//     constructor(expectedStatusCodes: number[]) {
//         this.expectedStatusCodes = expectedStatusCodes;
//     }
//     /**
//      * Configures request options before making a request.
//      */
//     public static CONFIGURE(options: request.OptionsWithUri): request.OptionsWithUri {
//         // set transporter user agent
//         options.headers = (options.headers !== undefined) ? options.headers : {};
//         if (!options.headers['User-Agent']) {
//             options.headers['User-Agent'] = DefaultTransporter.USER_AGENT;
//         } else if (options.headers['User-Agent'].indexOf(DefaultTransporter.USER_AGENT) === -1) {
//             options.headers['User-Agent'] = `${options.headers['User-Agent']} ${DefaultTransporter.USER_AGENT}`;
//         }
//         return options;
//     }
//     /**
//      * Makes a request with given options and invokes callback.
//      */
//     public async request(options: request.OptionsWithUri) {
//         const requestOptions = DefaultTransporter.CONFIGURE(options);
//         return await request(requestOptions)
//             .then((res) => this.wrapCallback(res));
//     }
//     /**
//      * Wraps the response callback.
//      */
//     private wrapCallback(res: request.FullResponse): any {
//         let err: RequestError = new RequestError('An unexpected error occurred');
//         debug('request processed', res.statusCode, res.body);
//         if (res.statusCode !== undefined) {
//             if (this.expectedStatusCodes.indexOf(res.statusCode) < 0) {
//                 if (typeof res.body === 'string') {
//                     // Consider all 4xx and 5xx responses errors.
//                     err = new RequestError(res.body);
//                     err.code = res.statusCode;
//                 }
//                 if (typeof res.body === 'object' && res.body.errors !== undefined) {
//                     // consider 400
//                     err = new RequestError((<any[]>res.body.errors).map((error) => `${error.title}:${error.detail}`).join('\n'));
//                     err.code = res.statusCode;
//                     err.errors = res.body.errors;
//                 }
//             } else {
//                 if (res.body !== undefined && res.body.data !== undefined) {
//                     // consider 200,201,404
//                     return res.body.data;
//                 } else {
//                     // consider 204
//                     return;
//                 }
//             }
//         }
//         throw err;
//     }
// }
