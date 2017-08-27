import OAuth2client from './auth/oAuth2client';
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
declare function apiFetch(options: IOptions): Promise<any>;
export default apiFetch;
