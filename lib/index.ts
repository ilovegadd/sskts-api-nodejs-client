/**
 * SSKTS API Node.js Client
 *
 * @ignore
 */

if (typeof process.env.SSKTS_OAUTH2_TOKEN_URL !== 'string' || (<string>process.env.SSKTS_OAUTH2_TOKEN_URL).length === 0) {
    throw new Error('NPM warnings. The environment variable "SSKTS_OAUTH2_TOKEN_URL" is required for using @motionpicture/sskts-api');
}
if (typeof process.env.SSKTS_API_ENDPOINT !== 'string' || (<string>process.env.SSKTS_API_ENDPOINT).length === 0) {
    throw new Error('NPM warnings. The environment variable "SSKTS_API_ENDPOINT" is required for using @motionpicture/sskts-api');
}

import ClientCredentialsClient from './auth/clientCredentialsClient';
import GoogleTokenClient from './auth/googleTokenClient';

import * as EventService from './service/event';
import * as OrderService from './service/order';
import * as OrganizationService from './service/organization';
import * as PersonService from './service/person';
import * as PlaceService from './service/place';
import * as PlaceOrderTransactionService from './service/transaction/placeOrder';

export namespace auth {
    /**
     * auth/ClientCredentials
     */
    export class ClientCredentials extends ClientCredentialsClient { }
    /**
     * auth/GoogleToken
     */
    export class GoogleToken extends GoogleTokenClient { }
}

export namespace service {
    export import event = EventService;
    export import order = OrderService;
    export import organization = OrganizationService;
    export import person = PersonService;
    export import place = PlaceService;
    export namespace transaction {
        export import placeOrder = PlaceOrderTransactionService;
    }
}
