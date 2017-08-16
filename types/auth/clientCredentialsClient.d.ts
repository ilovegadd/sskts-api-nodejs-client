import ICredentials from './credentials';
import OAuth2client from './oAuth2client';
/**
 * クライアント認証OAuthクライアント
 *
 * @class ClientCredentialsClient
 */
export default class ClientCredentialsClient extends OAuth2client {
    constructor(clientId: string, clientSecret: string, state: string, scopes: string[]);
    /**
     * クライアント認証でアクセストークンを取得します。
     */
    getToken(): Promise<ICredentials>;
    /**
     * Refreshes the access token.
     */
    protected refreshToken(__: string): Promise<ICredentials>;
}
