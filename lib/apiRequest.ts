/**
 * APIリクエストモジュール
 */

import * as request from 'request-promise-native';

import { DefaultTransporter } from './transporters';

export interface IOptions extends request.OptionsWithUri {
    expectedStatusCodes: number[];
}

/**
 * Create and send request to API
 */
async function apiRequest(options: IOptions) {
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

    options = { ...defaultOptions, ...options };

    return await (new DefaultTransporter(expectedStatusCodes)).request(options);
}

export default apiRequest;
