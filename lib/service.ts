/**
 * base service class
 */

import OAuth2client from './auth/oAuth2client';

export interface IOptions {
    endpoint: string;
    auth: OAuth2client;
}

export class Service {
    public options: IOptions;

    constructor(options: IOptions) {
        this.options = options;
    }
}
