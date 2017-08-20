import ClientCredentialsClient from './auth/clientCredentialsClient';
import { IOptions } from './service';
import { EventService } from './service/event';
import { OrderService } from './service/order';
import { OrganizationService } from './service/organization';
import { PersonService } from './service/person';
import { PlaceService } from './service/place';
import { PlaceOrderTransactionService } from './service/transaction/placeOrder';
export declare namespace auth {
    /**
     * auth/ClientCredentials
     */
    class ClientCredentials extends ClientCredentialsClient {
    }
}
export declare namespace service {
    function event(options: IOptions): EventService;
    function order(options: IOptions): OrderService;
    function organization(options: IOptions): OrganizationService;
    function person(options: IOptions): PersonService;
    function place(options: IOptions): PlaceService;
    namespace transaction {
        function placeOrder(options: IOptions): PlaceOrderTransactionService;
    }
}
