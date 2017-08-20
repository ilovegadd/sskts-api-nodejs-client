/// <reference types="request-promise-native" />
import * as request from 'request-promise-native';
import ICredentials from './credentials';
export interface IOptions {
    domain: string;
    clientId?: string;
    clientSecret?: string;
    redirectUri?: string;
    logoutUri?: string;
    responseType?: string;
    responseMode?: string;
    scopes?: string[];
    state: string;
    nonce?: string | null;
    audience?: string;
    tokenIssuer?: string;
}
/**
 * OAuth2 client
 */
export default class OAuth2client {
    credentials: ICredentials;
    options: IOptions;
    constructor(options: IOptions);
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
