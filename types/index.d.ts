import ClientCredentialsClient from './auth/clientCredentialsClient';
import GoogleTokenClient from './auth/googleTokenClient';
import * as EventService from './service/event';
import * as OrderService from './service/order';
import * as OrganizationService from './service/organization';
import * as PersonService from './service/person';
import * as PlaceService from './service/place';
import * as PlaceOrderTransactionService from './service/transaction/placeOrder';
export declare namespace auth {
    /**
     * auth/ClientCredentials
     */
    class ClientCredentials extends ClientCredentialsClient {
    }
    /**
     * auth/GoogleToken
     */
    class GoogleToken extends GoogleTokenClient {
    }
}
export declare namespace service {
    export import event = EventService;
    export import order = OrderService;
    export import organization = OrganizationService;
    export import person = PersonService;
    export import place = PlaceService;
    namespace transaction {
        export import placeOrder = PlaceOrderTransactionService;
    }
}
