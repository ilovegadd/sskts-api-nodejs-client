import ICredentials from './credentials';

/**
 * auth client abstract class
 * @class
 */
export abstract class AuthClient {
    public credentials: ICredentials;

    /**
     * Provides an alternative request
     * implementations with auth credentials.
     */
    public abstract async fetch(url: string, options: RequestInit, expectedStatusCodes: number[]): Promise<any>;
}
