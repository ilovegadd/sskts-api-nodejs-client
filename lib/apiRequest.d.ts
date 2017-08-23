/**
 * APIリクエストモジュール
 */
import OAuth2client from './auth/oAuth2client';
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
declare function apiRequest(params: IParams): Promise<any>;
export default apiRequest;
