/**
 * base service class
 */

import OAuth2client from './auth/oAuth2client';

export interface IOptions {
    /**
     * API endpoint
     * @example
     * http://localhost:8081
     */
    endpoint: string;
    /**
     * OAuth2 client object
     */
    auth: OAuth2client;
}

export class Service {
    public options: IOptions;

    constructor(options: IOptions) {
        this.options = options;
    }
}
