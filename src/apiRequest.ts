/**
 * APIリクエストモジュール
 */

import OAuth2client from './auth/oAuth2client';
// import { DefaultTransporter } from './transporters';

export interface IParams {
    uri: string;
    baseUrl: string;
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
// async function apiRequest(params: IParams) {
//     const expectedStatusCodes = params.expectedStatusCodes;

//     const authClient = params.auth;

//     const defaultOptions = {
//         headers: {},
//         qs: {},
//         json: true,
//         simple: false,
//         resolveWithFullResponse: true,
//         useQuerystring: true
//     };

//     const options = {
//         ...defaultOptions,
//         ...{
//             uri: params.uri,
//             baseUrl: params.baseUrl,
//             form: params.form,
//             qs: params.qs,
//             method: params.method,
//             headers: params.headers,
//             body: params.body
//         }
//     };

//     // create request (using authClient or otherwise and return request obj)
//     if (authClient !== undefined) {
//         return await authClient.request(options, expectedStatusCodes);
//     } else {
//         return await (new DefaultTransporter(expectedStatusCodes)).request(options);
//     }
// }

// export default apiRequest;
