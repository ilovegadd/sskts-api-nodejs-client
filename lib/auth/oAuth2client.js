"use strict";
/**
 * OAuth2クライアント
 */
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const crypto = require("crypto");
const createDebug = require("debug");
const http_status_1 = require("http-status");
const fetch = require("isomorphic-fetch");
const querystring = require("querystring");
const sskts_api_abstract_client_1 = require("@motionpicture/sskts-api-abstract-client");
const debug = createDebug('sskts-api-nodejs-client:auth:oAuth2client');
/**
 * OAuth2 client
 */
class OAuth2client {
    constructor(options) {
        // tslint:disable-next-line:no-suspicious-comment
        // TODO add minimum validation
        this.options = options;
        this.credentials = {};
    }
    static BASE64URLENCODE(str) {
        return str.toString('base64')
            .replace(/\+/g, '-')
            .replace(/\//g, '_')
            .replace(/=/g, '');
    }
    static SHA256(buffer) {
        return crypto.createHash('sha256').update(buffer).digest();
    }
    /**
     * Generates URL for consent page landing.
     */
    generateAuthUrl(optOpts) {
        const options = {
            response_type: 'code',
            client_id: this.options.clientId,
            redirect_uri: this.options.redirectUri,
            scope: optOpts.scopes.join(' '),
            state: optOpts.state
        };
        if (optOpts.codeVerifier !== undefined) {
            options.code_challenge_method = 'S256';
            options.code_challenge = OAuth2client.BASE64URLENCODE(OAuth2client.SHA256(optOpts.codeVerifier));
        }
        const rootUrl = `https://${this.options.domain}${OAuth2client.OAUTH2_AUTH_BASE_URI}`;
        return `${rootUrl}?${querystring.stringify(options)}`;
    }
    /**
     * Generates URL for logout.
     */
    generateLogoutUrl() {
        const options = {
            client_id: this.options.clientId,
            logout_uri: this.options.logoutUri
        };
        const rootUrl = `https://${this.options.domain}${OAuth2client.OAUTH2_LOGOUT_URI}`;
        return `${rootUrl}?${querystring.stringify(options)}`;
    }
    /**
     * Gets the access token for the given code.
     * @param {string} code The authorization code.
     */
    getToken(code, codeVerifier) {
        return __awaiter(this, void 0, void 0, function* () {
            const form = {
                code: code,
                client_id: this.options.clientId,
                redirect_uri: this.options.redirectUri,
                grant_type: 'authorization_code',
                code_verifier: codeVerifier
            };
            const secret = Buffer.from(`${this.options.clientId}:${this.options.clientSecret}`, 'utf8').toString('base64');
            const options = {
                body: querystring.stringify(form),
                method: 'POST',
                headers: {
                    Authorization: `Basic ${secret}`,
                    'Content-Type': 'application/x-www-form-urlencoded'
                }
            };
            debug('fetching...', options);
            return yield fetch(`https://${this.options.domain}${OAuth2client.OAUTH2_TOKEN_URI}`, options).then((response) => __awaiter(this, void 0, void 0, function* () {
                debug('response:', response.status);
                if (response.status !== http_status_1.OK) {
                    if (response.status === http_status_1.BAD_REQUEST) {
                        const body = yield response.json();
                        throw new Error(body.error);
                    }
                    else {
                        const body = yield response.text();
                        throw new Error(body);
                    }
                }
                else {
                    const tokens = yield response.json();
                    if (tokens && tokens.expires_in) {
                        // tslint:disable-next-line:no-magic-numbers
                        tokens.expiry_date = ((new Date()).getTime() + (tokens.expires_in * 1000));
                        delete tokens.expires_in;
                    }
                    return tokens;
                }
            }));
        });
    }
    /**
     * OAuthクライアントに認証情報をセットします。
     */
    setCredentials(credentials) {
        this.credentials = credentials;
    }
    refreshAccessToken() {
        return __awaiter(this, void 0, void 0, function* () {
            if (this.credentials.refresh_token === undefined) {
                throw new Error('No refresh token is set.');
            }
            return yield this.refreshToken(this.credentials.refresh_token)
                .then((tokens) => {
                tokens.refresh_token = this.credentials.refresh_token;
                debug('setting credentials...', tokens);
                this.credentials = tokens;
                return this.credentials;
            });
        });
    }
    /**
     * 期限の切れていないアクセストークンを取得します。
     * 必要であれば更新してから取得します。
     */
    getAccessToken() {
        return __awaiter(this, void 0, void 0, function* () {
            // tslint:disable-next-line:max-line-length
            const expiryDate = this.credentials.expiry_date;
            // if no expiry time, assume it's not expired
            const isTokenExpired = (expiryDate !== undefined) ? (expiryDate <= (new Date()).getTime()) : false;
            if (this.credentials.access_token === undefined && this.credentials.refresh_token === undefined) {
                throw new Error('No access or refresh token is set.');
            }
            const shouldRefresh = (this.credentials.access_token === undefined) || isTokenExpired;
            if (shouldRefresh && this.credentials.refresh_token !== undefined) {
                yield this.refreshAccessToken();
            }
            return this.credentials.access_token;
        });
    }
    // public async signInWithLINE(idToken: string): Promise<ICredentials> {
    //     // request for new token
    //     debug('requesting access token...');
    //     return await request.post({
    //         url: `${API_ENDPOINT}/oauth/token/signInWithGoogle`,
    //         body: {
    //             idToken: idToken,
    //             client_id: this.clientId,
    //             client_secret: this.clientSecret,
    //             scopes: this.scopes,
    //             state: this.state
    //         },
    //         json: true,
    //         simple: false,
    //         resolveWithFullResponse: true,
    //         useQuerystring: true
    //     }).then((response) => {
    //         if (response.statusCode !== httpStatus.OK) {
    //             if (typeof response.body === 'string') {
    //                 throw new Error(response.body);
    //             }
    //             if (typeof response.body === 'object' && response.body.errors !== undefined) {
    //                 const message = (<any[]>response.body.errors).map((error) => {
    //                     return `[${error.title}]${error.detail}`;
    //                 }).join(', ');
    //                 throw new Error(message);
    //             }
    //             throw new Error('An unexpected error occurred');
    //         }
    //         const tokens = response.body;
    //         if (tokens && tokens.expires_in) {
    //             // tslint:disable-next-line:no-magic-numbers
    //             tokens.expiry_date = ((new Date()).getTime() + (tokens.expires_in * 1000));
    //             delete tokens.expires_in;
    //         }
    //         this.credentials = tokens;
    //         return tokens;
    //     });
    // }
    /**
     * Revokes the access given to token.
     * @param {string} token The existing token to be revoked.
     */
    // public revokeToken(token: string) {
    // }
    /**
     * Provides a request implementation with OAuth 2.0 flow.
     * If credentials have a refresh_token, in cases of HTTP
     * 401 and 403 responses, it automatically asks for a new
     * access token and replays the unsuccessful request.
     * @param {request.OptionsWithUri} options Request options.
     * @return {Promise<any>}
     */
    fetch(url, options, expectedStatusCodes) {
        return __awaiter(this, void 0, void 0, function* () {
            // Callbacks will close over this to ensure that we only retry once
            let retry = true;
            const accessToken = yield this.getAccessToken();
            options.headers = (options.headers === undefined || options.headers === null) ? {} : options.headers;
            options.headers.Authorization = `Bearer ${accessToken}`;
            let result;
            let numberOfTry = 0;
            // tslint:disable-next-line:no-magic-numbers
            while (numberOfTry >= 0) {
                try {
                    numberOfTry += 1;
                    if (numberOfTry > 1) {
                        retry = false;
                    }
                    result = yield this.makeFetch(url, options, expectedStatusCodes);
                    break;
                }
                catch (error) {
                    if (error instanceof Error) {
                        const statusCode = error.code;
                        if (retry && (statusCode === http_status_1.UNAUTHORIZED || statusCode === http_status_1.FORBIDDEN)) {
                            /* It only makes sense to retry once, because the retry is intended
                             * to handle expiration-related failures. If refreshing the token
                             * does not fix the failure, then refreshing again probably won't
                             * help */
                            // Force token refresh
                            yield this.refreshAccessToken();
                            continue;
                        }
                    }
                    // retry = false;
                    throw error;
                }
            }
            return result;
        });
    }
    /**
     * Provides a request implementation with OAuth 2.0 flow.
     * If credentials have a refresh_token, in cases of HTTP
     * 401 and 403 responses, it automatically asks for a new
     * access token and replays the unsuccessful request.
     * @param {request.OptionsWithUri} options Request options.
     * @return {Promise<any>}
     */
    // public async request(options: request.OptionsWithUri, expectedStatusCodes: number[]) {
    //     const accessToken = await this.getAccessToken();
    //     options.auth = { bearer: accessToken };
    //     return this.makeRequest(options, expectedStatusCodes);
    // }
    /**
     * Makes a request without paying attention to refreshing or anything
     * Assumes that all credentials are set correctly.
     * @param  {object}   opts     Options for request
     * @param  {Function} callback callback function
     * @return {Request}           The request object created
     */
    // tslint:disable-next-line:prefer-function-over-method
    // public async makeRequest(options: request.OptionsWithUri, expectedStatusCodes: number[]) {
    //     const transporter = new DefaultTransporter(expectedStatusCodes);
    //     return transporter.request(options);
    // }
    /**
     * Makes a request without paying attention to refreshing or anything
     * Assumes that all credentials are set correctly.
     * @param  {object}   opts     Options for request
     * @param  {Function} callback callback function
     * @return {Request}           The request object created
     */
    // tslint:disable-next-line:prefer-function-over-method
    makeFetch(url, options, expectedStatusCodes) {
        return __awaiter(this, void 0, void 0, function* () {
            const transporter = new sskts_api_abstract_client_1.transporters.DefaultTransporter(expectedStatusCodes);
            return yield transporter.fetch(url, options);
        });
    }
    /**
     * Verify id token is token by checking the certs and audience
     * @param {string} idToken ID Token.
     * @param {(string|Array.<string>)} audience The audience to verify against the ID Token
     * @param {function=} callback Callback supplying GoogleLogin if successful
     */
    // public verifyIdToken(
    //     idToken: string, audience: string | string[],
    //     callback: (err: Error, login?: LoginTicket) => void) {
    //     if (!idToken || !callback) {
    //         throw new Error(
    //             'The verifyIdToken method requires both ' +
    //             'an ID Token and a callback method');
    //     }
    //     this.getFederatedSignonCerts(((err: Error, certs: any) => {
    //         if (err) {
    //             callback(err, null);
    //         }
    //         let login;
    //         try {
    //             login = this.verifySignedJwtWithCerts(
    //                 idToken, certs, audience,
    //                 OAuth2Client.ISSUERS_);
    //         } catch (err) {
    //             callback(err);
    //             return;
    //         }
    //         callback(null, login);
    //     }).bind(this));
    // }
    /**
     * Gets federated sign-on certificates to use for verifying identity tokens.
     * Returns certs as array structure, where keys are key ids, and values
     * are PEM encoded certificates.
     * @param {function=} callback Callback supplying the certificates
     */
    // public getFederatedSignonCerts(callback: BodyResponseCallback) {
    //     const nowTime = (new Date()).getTime();
    //     if (this._certificateExpiry &&
    //         (nowTime < this._certificateExpiry.getTime())) {
    //         callback(null, this._certificateCache);
    //         return;
    //     }
    //     this.transporter.request(
    //         {
    //             method: 'GET',
    //             uri: OAuth2Client.GOOGLE_OAUTH2_FEDERATED_SIGNON_CERTS_URL_,
    //             json: true
    //         },
    //         (err, body, response) => {
    //             if (err) {
    //                 callback(
    //                     new RequestError(
    //                         'Failed to retrieve verification certificates: ' + err),
    //                     null, response);
    //                 return;
    //             }
    //             const cacheControl = response.headers['cache-control'];
    //             let cacheAge = -1;
    //             if (cacheControl) {
    //                 const pattern = new RegExp('max-age=([0-9]*)');
    //                 const regexResult = pattern.exec(cacheControl);
    //                 if (regexResult.length === 2) {
    //                     // Cache results with max-age (in seconds)
    //                     cacheAge = Number(regexResult[1]) * 1000;  // milliseconds
    //                 }
    //             }
    //             const now = new Date();
    //             this._certificateExpiry =
    //                 cacheAge === -1 ? null : new Date(now.getTime() + cacheAge);
    //             this._certificateCache = body;
    //             callback(null, body, response);
    //         });
    // }
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
    // public verifySignedJwtWithCerts(
    //     jwt: string, certs: any, requiredAudience: string | string[],
    //     issuers?: string[], maxExpiry?: number) {
    //     if (!maxExpiry) {
    //         maxExpiry = OAuth2Client.MAX_TOKEN_LIFETIME_SECS_;
    //     }
    //     const segments = jwt.split('.');
    //     if (segments.length !== 3) {
    //         throw new Error('Wrong number of segments in token: ' + jwt);
    //     }
    //     const signed = segments[0] + '.' + segments[1];
    //     const signature = segments[2];
    //     let envelope;
    //     let payload;
    //     try {
    //         envelope = JSON.parse(this.decodeBase64(segments[0]));
    //     } catch (err) {
    //         throw new Error('Can\'t parse token envelope: ' + segments[0]);
    //     }
    //     if (!envelope) {
    //         throw new Error('Can\'t parse token envelope: ' + segments[0]);
    //     }
    //     try {
    //         payload = JSON.parse(this.decodeBase64(segments[1]));
    //     } catch (err) {
    //         throw new Error('Can\'t parse token payload: ' + segments[0]);
    //     }
    //     if (!payload) {
    //         throw new Error('Can\'t parse token payload: ' + segments[1]);
    //     }
    //     if (!certs.hasOwnProperty(envelope.kid)) {
    //         // If this is not present, then there's no reason to attempt verification
    //         throw new Error('No pem found for envelope: ' + JSON.stringify(envelope));
    //     }
    //     const pem = certs[envelope.kid];
    //     const pemVerifier = new PemVerifier();
    //     const verified = pemVerifier.verify(pem, signed, signature, 'base64');
    //     if (!verified) {
    //         throw new Error('Invalid token signature: ' + jwt);
    //     }
    //     if (!payload.iat) {
    //         throw new Error('No issue time in token: ' + JSON.stringify(payload));
    //     }
    //     if (!payload.exp) {
    //         throw new Error(
    //             'No expiration time in token: ' + JSON.stringify(payload));
    //     }
    //     const iat = parseInt(payload.iat, 10);
    //     const exp = parseInt(payload.exp, 10);
    //     const now = new Date().getTime() / 1000;
    //     if (exp >= now + maxExpiry) {
    //         throw new Error(
    //             'Expiration time too far in future: ' + JSON.stringify(payload));
    //     }
    //     const earliest = iat - OAuth2Client.CLOCK_SKEW_SECS_;
    //     const latest = exp + OAuth2Client.CLOCK_SKEW_SECS_;
    //     if (now < earliest) {
    //         throw new Error(
    //             'Token used too early, ' + now + ' < ' + earliest + ': ' +
    //             JSON.stringify(payload));
    //     }
    //     if (now > latest) {
    //         throw new Error(
    //             'Token used too late, ' + now + ' > ' + latest + ': ' +
    //             JSON.stringify(payload));
    //     }
    //     if (issuers && issuers.indexOf(payload.iss) < 0) {
    //         throw new Error(
    //             'Invalid issuer, expected one of [' + issuers + '], but got ' +
    //             payload.iss);
    //     }
    //     // Check the audience matches if we have one
    //     if (typeof requiredAudience !== 'undefined' && requiredAudience !== null) {
    //         const aud = payload.aud;
    //         let audVerified = false;
    //         // If the requiredAudience is an array, check if it contains token
    //         // audience
    //         if (requiredAudience.constructor === Array) {
    //             audVerified = (requiredAudience.indexOf(aud) > -1);
    //         } else {
    //             audVerified = (aud === requiredAudience);
    //         }
    //         if (!audVerified) {
    //             throw new Error(
    //                 'Wrong recipient, payload audience != requiredAudience');
    //         }
    //     }
    //     return new LoginTicket(envelope, payload);
    // }
    /**
     * This is a utils method to decode a base64 string
     * @param {string} b64String The string to base64 decode
     * @return {string} The decoded string
     */
    // public decodeBase64(b64String: string) {
    //     const buffer = new Buffer(b64String, 'base64');
    //     return buffer.toString('utf8');
    // }
    /**
     * Refreshes the access token.
     */
    refreshToken(refreshToken) {
        return __awaiter(this, void 0, void 0, function* () {
            // request for new token
            debug('refreshing access token...', this.credentials, refreshToken);
            const form = {
                client_id: this.options.clientId,
                refresh_token: refreshToken,
                grant_type: 'refresh_token'
            };
            const secret = Buffer.from(`${this.options.clientId}:${this.options.clientSecret}`, 'utf8').toString('base64');
            const options = {
                body: querystring.stringify(form),
                method: 'POST',
                headers: {
                    Authorization: `Basic ${secret}`,
                    'Content-Type': 'application/x-www-form-urlencoded'
                }
            };
            debug('fetching...', options);
            return yield fetch(`https://${this.options.domain}${OAuth2client.OAUTH2_TOKEN_URI}`, options).then((response) => __awaiter(this, void 0, void 0, function* () {
                debug('response:', response.status);
                if (response.status !== http_status_1.OK) {
                    if (response.status === http_status_1.BAD_REQUEST) {
                        const body = yield response.json();
                        throw new Error(body.error);
                    }
                    else {
                        const body = yield response.text();
                        throw new Error(body);
                    }
                }
                else {
                    const tokens = yield response.json();
                    if (tokens && tokens.expires_in) {
                        // tslint:disable-next-line:no-magic-numbers
                        tokens.expiry_date = ((new Date()).getTime() + (tokens.expires_in * 1000));
                        delete tokens.expires_in;
                    }
                    return tokens;
                }
            }));
        });
    }
}
/**
 * The base URL for auth endpoints.
 */
OAuth2client.OAUTH2_AUTH_BASE_URI = '/authorize';
/**
 * The base endpoint for token retrieval.
 */
OAuth2client.OAUTH2_TOKEN_URI = '/token';
/**
 * The base endpoint to revoke tokens.
 */
OAuth2client.OAUTH2_LOGOUT_URI = '/logout';
exports.default = OAuth2client;
