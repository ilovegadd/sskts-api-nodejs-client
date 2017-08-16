/**
 * APIリクエストモジュール
 */

import * as request from 'request-promise-native';

import { DefaultTransporter } from './transporters';

const API_ENDPOINT = <string>process.env.SSKTS_API_ENDPOINT;

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
        baseUrl: API_ENDPOINT,
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
