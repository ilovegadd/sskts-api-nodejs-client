import * as createDebug from 'debug';
import * as httpStatus from 'http-status';
import * as request from 'request-promise-native';

import ICredentials from './credentials';
import OAuth2client from './oAuth2client';

const debug = createDebug('sasaki-api:auth:clientCredentialsClient');

export interface IOptions {
    domain: string;
    clientId: string;
    clientSecret: string;
    scopes: string[];
    state: string;
}

/**
 * クライアント認証OAuthクライアント
 *
 * @class ClientCredentialsClient
 */
export default class ClientCredentialsClient extends OAuth2client {
    public options: IOptions;

    constructor(options: IOptions) {
        super(options);
        this.options = options;

        this.credentials = { refresh_token: 'ignored' };
    }

    /**
     * クライアント認証でアクセストークンを取得します。
     */
    public async getToken() {
        debug('requesting an access token...');

        return await request.post({
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

            return <ICredentials>tokens;
        });
    }

    /**
     * Refreshes the access token.
     */
    protected async refreshToken(__: string): Promise<ICredentials> {
        debug('refreshing an access token...');

        return this.getToken();
    }
}
