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
export declare namespace auth {
    /**
     * OAuth2 client using grant type 'client_credentials'
     */
    class ClientCredentials extends ClientCredentialsClient {
    }
}
/**
 * each API services
 */
export declare namespace service {
    /**
     * event service
     * @param {IOptions} options service configurations
     */
    function event(options: IOptions): EventService;
    /**
     * order service
     * @param {IOptions} options service configurations
     */
    function order(options: IOptions): OrderService;
    /**
     * organization service
     * @param {IOptions} options service configurations
     */
    function organization(options: IOptions): OrganizationService;
    /**
     * person service
     * @param {IOptions} options service configurations
     */
    function person(options: IOptions): PersonService;
    /**
     * place service
     * @param {IOptions} options service configurations
     */
    function place(options: IOptions): PlaceService;
    namespace transaction {
        /**
         * placeOrder transaction service
         * @param {IOptions} options service configurations
         */
        function placeOrder(options: IOptions): PlaceOrderTransactionService;
    }
}
