import ICredentials from '../../lib/auth/credentials';
import OAuth2client from '../../lib/auth/oAuth2client';

export interface IOptions {
    domain: string;
}

/**
 * テストOAuthクライアント
 * @class TestClient
 */
export default class TestClient extends OAuth2client {
    public options: IOptions;

    constructor(options: IOptions) {
        super(options);
        this.options = options;

        this.credentials = { refresh_token: 'ignored' };
    }

    // tslint:disable-next-line:prefer-function-over-method
    public async getToken(): Promise<ICredentials> {
        return {
            refresh_token: 'ignored',
            expiry_date: 4657740852,
            access_token: 'access_token',
            token_type: 'Bearer'
        };
    }

    protected async refreshToken(__: string): Promise<ICredentials> {
        return this.getToken();
    }
}
