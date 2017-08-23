/**
 * sasaki API Node.js Client
 *
 * @ignore
 */

import ClientCredentialsClient from './auth/clientCredentialsClient';

import { IOptions } from './service';
import { EventService } from './service/event';
import { OrderService } from './service/order';
import { OrganizationService } from './service/organization';
import { PersonService } from './service/person';
import { PlaceService } from './service/place';
import { PlaceOrderTransactionService } from './service/transaction/placeOrder';

/**
 * each OAuth2 clients
 */
export namespace auth {
    /**
     * OAuth2 client using grant type 'client_credentials'
     */
    export class ClientCredentials extends ClientCredentialsClient { }
}

/**
 * each API services
 */
export namespace service {
    /**
     * event service
     * @param {IOptions} options service configurations
     */
    export function event(options: IOptions) {
        return new EventService(options);
    }
    /**
     * order service
     * @param {IOptions} options service configurations
     */
    export function order(options: IOptions) {
        return new OrderService(options);
    }
    /**
     * organization service
     * @param {IOptions} options service configurations
     */
    export function organization(options: IOptions) {
        return new OrganizationService(options);
    }
    /**
     * person service
     * @param {IOptions} options service configurations
     */
    export function person(options: IOptions) {
        return new PersonService(options);
    }
    /**
     * place service
     * @param {IOptions} options service configurations
     */
    export function place(options: IOptions) {
        return new PlaceService(options);
    }
    export namespace transaction {
        /**
         * placeOrder transaction service
         * @param {IOptions} options service configurations
         */
        export function placeOrder(options: IOptions) {
            return new PlaceOrderTransactionService(options);
        }
    }
}
