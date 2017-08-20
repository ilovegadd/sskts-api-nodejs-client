/**
 * SSKTS API Node.js Client
 *
 * @ignore
 */

if (typeof process.env.SSKTS_OAUTH2_TOKEN_URL !== 'string' || (<string>process.env.SSKTS_OAUTH2_TOKEN_URL).length === 0) {
    throw new Error('NPM warnings. The environment variable "SSKTS_OAUTH2_TOKEN_URL" is required for using @motionpicture/sskts-api');
}

import ClientCredentialsClient from './auth/clientCredentialsClient';

import { IOptions } from './service';
import { EventService } from './service/event';
import { OrderService } from './service/order';
import { OrganizationService } from './service/organization';
import { PersonService } from './service/person';
import { PlaceService } from './service/place';
import { PlaceOrderTransactionService } from './service/transaction/placeOrder';

export namespace auth {
    /**
     * auth/ClientCredentials
     */
    export class ClientCredentials extends ClientCredentialsClient { }
}

export namespace service {
    export function event(options: IOptions) {
        return new EventService(options);
    }
    export function order(options: IOptions) {
        return new OrderService(options);
    }
    export function organization(options: IOptions) {
        return new OrganizationService(options);
    }
    export function person(options: IOptions) {
        return new PersonService(options);
    }
    export function place(options: IOptions) {
        return new PlaceService(options);
    }
    export namespace transaction {
        export function placeOrder(options: IOptions) {
            return new PlaceOrderTransactionService(options);
        }
    }
}
