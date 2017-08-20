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
     * Refreshes the access token.
     */
    protected refreshToken(refreshToken: string): Promise<ICredentials>;
}
