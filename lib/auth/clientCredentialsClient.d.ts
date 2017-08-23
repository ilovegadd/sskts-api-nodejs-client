import ICredentials from './credentials';
import OAuth2client from './oAuth2client';
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
    options: IOptions;
    constructor(options: IOptions);
    /**
     * クライアント認証でアクセストークンを取得します。
     */
    getToken(): Promise<ICredentials>;
    /**
     * Refreshes the access token.
     */
    protected refreshToken(__: string): Promise<ICredentials>;
}
