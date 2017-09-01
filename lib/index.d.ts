/**
 * sasaki API Node.js Client
 *
 * @ignore
 */
import * as factory from '@motionpicture/sskts-factory';
import ClientCredentialsClient from './auth/clientCredentialsClient';
import OAuth2client from './auth/oAuth2client';
import { IOptions } from './service';
import { EventService } from './service/event';
import { OrderService } from './service/order';
import { OrganizationService } from './service/organization';
import { PersonService } from './service/person';
import { PlaceService } from './service/place';
import { PlaceOrderTransactionService } from './service/transaction/placeOrder';
/**
 * factory
 * All object interfaces are here.
 * 全てのオブジェクトのインターフェースはここに含まれます。
 * @export
 */
export import factory = factory;
/**
 * each OAuth2 clients
 */
export declare namespace auth {
    /**
     * OAuth2 client using grant type 'client_credentials'
     */
    class ClientCredentials extends ClientCredentialsClient {
    }
    /**
     * OAuth2 client using grant type 'authorization_code'
     */
    class OAuth2 extends OAuth2client {
    }
}
/**
 * each API services
 */
export declare namespace service {
    /**
     * event service
     * @class
     */
    class Event extends EventService {
    }
    /**
     * order service
     * @class
     */
    class Order extends OrderService {
    }
    /**
     * organization service
     * @class
     */
    class Organization extends OrganizationService {
    }
    /**
     * person service
     * @class
     */
    class Person extends PersonService {
    }
    /**
     * place service
     * @class
     */
    class Place extends PlaceService {
    }
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
         * @class
         */
        class PlaceOrder extends PlaceOrderTransactionService {
        }
        /**
         * placeOrder transaction service
         * @param {IOptions} options service configurations
         */
        function placeOrder(options: IOptions): PlaceOrderTransactionService;
    }
}
