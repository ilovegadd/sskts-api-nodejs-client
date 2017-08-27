import ICredentials from './credentials';
/**
 * auth client abstract class
 * @class
 */
export declare abstract class AuthClient {
    credentials: ICredentials;
    /**
     * Provides an alternative request
     * implementations with auth credentials.
     */
    abstract fetch(url: string, options: RequestInit, expectedStatusCodes: number[]): Promise<any>;
}
