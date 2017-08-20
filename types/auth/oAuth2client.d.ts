/// <reference types="request-promise-native" />
import * as request from 'request-promise-native';
import ICredentials from './credentials';
/**
 * OAuth2client
 */
export default class OAuth2client {
    protected static readonly SSKTS_OAUTH2_TOKEN_URL: string;
    credentials: ICredentials;
    clientId: string;
    clientSecret: string;
    protected state: string;
    protected scopes: string[];
    constructor(clientId?: string, clientSecret?: string, state?: string, scopes?: string[]);
    /**
     * OAuthクライアントに認証情報をセットします。
     */
    setCredentials(credentials: ICredentials): void;
    refreshAccessToken(): Promise<ICredentials>;
    /**
     * 期限の切れていないアクセストークンを取得します。
     * 必要であれば更新してから取得します。
     */
    getAccessToken(): Promise<string>;
    /**
     * Provides a request implementation with OAuth 2.0 flow.
     * If credentials have a refresh_token, in cases of HTTP
     * 401 and 403 responses, it automatically asks for a new
     * access token and replays the unsuccessful request.
     * @param {request.OptionsWithUri} options Request options.
     * @return {Promise<any>}
     */
    request(options: request.OptionsWithUri, expectedStatusCodes: number[]): Promise<any>;
    /**
     * Makes a request without paying attention to refreshing or anything
     * Assumes that all credentials are set correctly.
     * @param  {object}   opts     Options for request
     * @param  {Function} callback callback function
     * @return {Request}           The request object created
     */
    makeRequest(options: request.OptionsWithUri, expectedStatusCodes: number[]): Promise<any>;
    /**
     * Refreshes the access token.
     */
    protected refreshToken(refreshToken: string): Promise<ICredentials>;
}
