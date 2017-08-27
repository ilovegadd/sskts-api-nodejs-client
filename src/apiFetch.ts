/**
 * API fetch module
 */

import * as querystring from 'querystring';

import OAuth2client from './auth/oAuth2client';
import { DefaultTransporter } from './transporters';

export interface IOptions {
    baseUrl: string;
    uri: string;
    form?: any;
    auth?: OAuth2client;
    qs?: any;
    method: string;
    headers?: {
        [key: string]: any;
    };
    body?: any;
    expectedStatusCodes: number[];
}

/**
 * Create and send request to API
 */
async function apiFetch(options: IOptions) {
    const defaultOptions = {
        headers: {},
        method: 'GET',
        qs: {}
    };
    options = { ...defaultOptions, ...options };

    const url = `${options.baseUrl}${options.uri}?${querystring.stringify(options.qs)}`;

    const headers = {
        ...{
            Accept: 'application/json',
            'Content-Type': 'application/json'
        },
        ...options.headers
    };

    const fetchOptions = {
        method: options.method,
        headers: headers,
        body: JSON.stringify(options.body)
    };

    // create request (using authClient or otherwise and return request obj)
    if (options.auth !== undefined) {
        return await options.auth.fetch(url, fetchOptions, options.expectedStatusCodes);
    } else {
        return await (new DefaultTransporter(options.expectedStatusCodes)).fetch(url, fetchOptions);
    }
}

export default apiFetch;
