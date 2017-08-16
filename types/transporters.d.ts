/// <reference types="request-promise-native" />
import * as request from 'request-promise-native';
export interface ITransporter {
    request(options: any, callback?: IBodyResponseCallback): any;
}
export declare type IBodyResponseCallback = Promise<any>;
/**
 * RequestError
 */
export declare class RequestError extends Error {
    code: number;
    errors: Error[];
}
/**
 * DefaultTransporter
 */
export declare class DefaultTransporter {
    /**
     * Default user agent.
     */
    static readonly USER_AGENT: string;
    expectedStatusCodes: number[];
    constructor(expectedStatusCodes: number[]);
    /**
     * Configures request options before making a request.
     */
    static CONFIGURE(options: request.OptionsWithUri): request.OptionsWithUri;
    /**
     * Makes a request with given options and invokes callback.
     */
    request(options: request.OptionsWithUri): Promise<any>;
    /**
     * Wraps the response callback.
     */
    private wrapCallback(res);
}
