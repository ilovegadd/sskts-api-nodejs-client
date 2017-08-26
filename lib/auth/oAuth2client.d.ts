/// <reference types="request-promise-native" />
import * as request from 'request-promise-native';
import ICredentials from './credentials';
export interface IGenerateAuthUrlOpts {
    response_type?: string;
    client_id?: string;
    redirect_uri?: string;
    scope?: string[] | string;
}
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
     * Generates URL for consent page landing.
     * @param {object=} opt_opts Options.
     * @return {string} URL to consent page.
     */
    generateAuthUrl(optOpts: IGenerateAuthUrlOpts): string;
    /**
     * Gets the access token for the given code.
     * @param {string} code The authorization code.
     */
    getToken(code: string): Promise<ICredentials>;
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
     * Revokes the access given to token.
     * @param {string} token The existing token to be revoked.
     * @param {function=} callback Optional callback fn.
     */
    /**
     * Revokes access token and clears the credentials object
     * @param  {Function=} callback callback
     */
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
     * Verify id token is token by checking the certs and audience
     * @param {string} idToken ID Token.
     * @param {(string|Array.<string>)} audience The audience to verify against the ID Token
     * @param {function=} callback Callback supplying GoogleLogin if successful
     */
    /**
     * Gets federated sign-on certificates to use for verifying identity tokens.
     * Returns certs as array structure, where keys are key ids, and values
     * are PEM encoded certificates.
     * @param {function=} callback Callback supplying the certificates
     */
    /**
     * Verify the id token is signed with the correct certificate
     * and is from the correct audience.
     * @param {string} jwt The jwt to verify (The ID Token in this case).
     * @param {array} certs The array of certs to test the jwt against.
     * @param {(string|Array.<string>)} requiredAudience The audience to test the jwt against.
     * @param {array} issuers The allowed issuers of the jwt (Optional).
     * @param {string} maxExpiry The max expiry the certificate can be (Optional).
     * @return {LoginTicket} Returns a LoginTicket on verification.
     */
    /**
     * This is a utils method to decode a base64 string
     * @param {string} b64String The string to base64 decode
     * @return {string} The decoded string
     */
    /**
     * Refreshes the access token.
     */
    protected refreshToken(refreshToken: string): Promise<ICredentials>;
}
