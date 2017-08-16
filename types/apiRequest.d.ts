/**
 * APIリクエストモジュール
 */
import * as request from 'request-promise-native';
export interface IOptions extends request.OptionsWithUri {
    expectedStatusCodes: number[];
}
/**
 * Create and send request to API
 */
declare function apiRequest(options: IOptions): Promise<any>;
export default apiRequest;
