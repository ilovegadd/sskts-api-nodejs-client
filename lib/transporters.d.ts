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
    static CONFIGURE(options: RequestInit): RequestInit;
    /**
     * Makes a request with given options and invokes callback.
     */
    fetch(url: string, options: RequestInit): Promise<any>;
    /**
     * Wraps the response callback.
     */
    private wrapCallback(response);
}
