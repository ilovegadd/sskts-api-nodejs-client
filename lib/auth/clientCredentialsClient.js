"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const createDebug = require("debug");
const httpStatus = require("http-status");
const request = require("request-promise-native");
const oAuth2client_1 = require("./oAuth2client");
const debug = createDebug('sasaki-api:auth:clientCredentialsClient');
/**
 * クライアント認証OAuthクライアント
 *
 * @class ClientCredentialsClient
 */
class ClientCredentialsClient extends oAuth2client_1.default {
    constructor(options) {
        super(options);
        this.options = options;
        this.credentials = { refresh_token: 'ignored' };
    }
    /**
     * クライアント認証でアクセストークンを取得します。
     */
    getToken() {
        return __awaiter(this, void 0, void 0, function* () {
            debug('requesting an access token...');
            return yield request.post({
                url: `https://${this.options.domain}/token`,
                form: {
                    scope: this.options.scopes.join(' '),
                    state: this.options.state,
                    grant_type: 'client_credentials'
                },
                auth: {
                    user: this.options.clientId,
                    pass: this.options.clientSecret
                },
                json: true,
                simple: false,
                resolveWithFullResponse: true,
                useQuerystring: true
            }).then((response) => {
                if (response.statusCode !== httpStatus.OK) {
                    if (typeof response.body === 'string') {
                        throw new Error(response.body);
                    }
                    debug(response.body);
                    if (typeof response.body === 'object' && response.body.error !== undefined) {
                        throw new Error(response.body.error);
                    }
                    throw new Error('An unexpected error occurred');
                }
                const tokens = response.body;
                if (tokens && tokens.expires_in) {
                    // tslint:disable-next-line:no-magic-numbers
                    tokens.expiry_date = ((new Date()).getTime() + (tokens.expires_in * 1000));
                    delete tokens.expires_in;
                }
                tokens.refresh_token = 'ignored';
                return tokens;
            });
        });
    }
    /**
     * Refreshes the access token.
     */
    refreshToken(__) {
        return __awaiter(this, void 0, void 0, function* () {
            debug('refreshing an access token...');
            return this.getToken();
        });
    }
}
exports.default = ClientCredentialsClient;
