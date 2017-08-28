/**
 * transporters
 *
 * @ignore
 */

import * as createDebug from 'debug';
import * as httpStatus from 'http-status';
import * as fetch from 'isomorphic-fetch';

const debug = createDebug('sasaki-api:transporters');
// tslint:disable-next-line
const pkg = require('../package.json');

export interface ITransporter {
    request(options: any, callback?: IBodyResponseCallback): any;
}

export type IBodyResponseCallback = Promise<any>;

/**
 * RequestError
 */
export class RequestError extends Error {
    public code: number;
    public errors: Error[];
}

/**
 * DefaultTransporter
 */
export class DefaultTransporter {
    /**
     * Default user agent.
     */
    public static readonly USER_AGENT: string = `sasaki-api-nodejs-client/${pkg.version}`;

    public expectedStatusCodes: number[];

    constructor(expectedStatusCodes: number[]) {
        this.expectedStatusCodes = expectedStatusCodes;
    }

    /**
     * Configures request options before making a request.
     */
    public static CONFIGURE(options: RequestInit): RequestInit {
        // set transporter user agent
        options.headers = (options.headers !== undefined) ? options.headers : {};
        if (!options.headers['User-Agent']) {
            options.headers['User-Agent'] = DefaultTransporter.USER_AGENT;
        } else if (options.headers['User-Agent'].indexOf(DefaultTransporter.USER_AGENT) === -1) {
            options.headers['User-Agent'] = `${options.headers['User-Agent']} ${DefaultTransporter.USER_AGENT}`;
        }

        return options;
    }

    /**
     * Makes a request with given options and invokes callback.
     */
    public async fetch(url: string, options: RequestInit) {
        const fetchOptions = DefaultTransporter.CONFIGURE(options);

        debug('fetching...', fetchOptions);

        return await fetch(url, fetchOptions).then(async (response) => this.wrapCallback(response));
    }

    /**
     * Wraps the response callback.
     */
    private async wrapCallback(response: Response): Promise<any> {
        let err: RequestError = new RequestError('An unexpected error occurred');

        debug('request processed', response.status);

        // if (err || !body) {
        //     return callback && callback(err, body, res);
        // }
        // // Only and only application/json responses should
        // // be decoded back to JSON, but there are cases API back-ends
        // // responds without proper content-type.
        // try {
        //     body = JSON.parse(body);
        // } catch (err) {
        //     /* no op */
        // }

        // if (body && body.error && res.statusCode !== 200) {
        //     if (typeof body.error === 'string') {
        //         err = new RequestError(body.error);
        //         (err as RequestError).code = res.statusCode;
        //     } else if (Array.isArray(body.error.errors)) {
        //         err = new RequestError(
        //             body.error.errors.map((err2: Error) => err2.message).join('\n'));
        //         (err as RequestError).code = body.error.code;
        //         (err as RequestError).errors = body.error.errors;
        //     } else {
        //         err = new RequestError(body.error.message);
        //         (err as RequestError).code = body.error.code || res.statusCode;
        //     }
        //     body = null;
        // } else if (res.statusCode >= 400) {
        //     // Consider all 4xx and 5xx responses errors.
        //     err = new RequestError(body);
        //     (err as RequestError).code = res.statusCode;
        //     body = null;
        // }

        if (this.expectedStatusCodes.indexOf(response.status) < 0) {
            // if (response.status >= httpStatus.UNAUTHORIZED) {
            //     const text = await response.text();
            //     err = new RequestError(text);
            //     err.code = response.status;
            //     err.errors = [];
            // }

            // Consider all 4xx and 5xx responses errors.
            const body = await response.json();
            if (typeof body === 'object' && body.error !== undefined) {
                err = new RequestError(body.error.message);
                err.code = response.status;
                err.errors = body.error.errors;
            }
        } else {
            if (response.status === httpStatus.NO_CONTENT) {
                // consider 204
                return;
            } else {
                const body = await response.json();
                if (body !== undefined && body.data !== undefined) {
                    // consider 200,201,404
                    return body.data;
                }
            }
        }

        throw err;
    }
}

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
