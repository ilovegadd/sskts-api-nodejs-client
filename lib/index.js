"use strict";
// tslint:disable:max-classes-per-file
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * sasaki API Node.js Client
 *
 * @ignore
 */
const factory = require("@motionpicture/sskts-factory");
const clientCredentialsClient_1 = require("./auth/clientCredentialsClient");
const oAuth2client_1 = require("./auth/oAuth2client");
const event_1 = require("./service/event");
const order_1 = require("./service/order");
const organization_1 = require("./service/organization");
const person_1 = require("./service/person");
const place_1 = require("./service/place");
const placeOrder_1 = require("./service/transaction/placeOrder");
/**
 * factory
 * All object interfaces are here.
 * 全てのオブジェクトのインターフェースはここに含まれます。
 * @export
 */
exports.factory = factory;
/**
 * each OAuth2 clients
 */
var auth;
(function (auth) {
    /**
     * OAuth2 client using grant type 'client_credentials'
     */
    class ClientCredentials extends clientCredentialsClient_1.default {
    }
    auth.ClientCredentials = ClientCredentials;
    /**
     * OAuth2 client using grant type 'authorization_code'
     */
    class OAuth2 extends oAuth2client_1.default {
    }
    auth.OAuth2 = OAuth2;
})(auth = exports.auth || (exports.auth = {}));
/**
 * each API services
 */
var service;
(function (service) {
    /**
     * event service
     * @class
     */
    class Event extends event_1.EventService {
    }
    service.Event = Event;
    /**
     * order service
     * @class
     */
    class Order extends order_1.OrderService {
    }
    service.Order = Order;
    /**
     * organization service
     * @class
     */
    class Organization extends organization_1.OrganizationService {
    }
    service.Organization = Organization;
    /**
     * person service
     * @class
     */
    class Person extends person_1.PersonService {
    }
    service.Person = Person;
    /**
     * place service
     * @class
     */
    class Place extends place_1.PlaceService {
    }
    service.Place = Place;
    /**
     * event service
     * @param {IOptions} options service configurations
     */
    function event(options) {
        return new event_1.EventService(options);
    }
    service.event = event;
    /**
     * order service
     * @param {IOptions} options service configurations
     */
    function order(options) {
        return new order_1.OrderService(options);
    }
    service.order = order;
    /**
     * organization service
     * @param {IOptions} options service configurations
     */
    function organization(options) {
        return new organization_1.OrganizationService(options);
    }
    service.organization = organization;
    /**
     * person service
     * @param {IOptions} options service configurations
     */
    function person(options) {
        return new person_1.PersonService(options);
    }
    service.person = person;
    /**
     * place service
     * @param {IOptions} options service configurations
     */
    function place(options) {
        return new place_1.PlaceService(options);
    }
    service.place = place;
    let transaction;
    (function (transaction) {
        /**
         * placeOrder transaction service
         * @class
         */
        class PlaceOrder extends placeOrder_1.PlaceOrderTransactionService {
        }
        transaction.PlaceOrder = PlaceOrder;
        /**
         * placeOrder transaction service
         * @param {IOptions} options service configurations
         */
        function placeOrder(options) {
            return new placeOrder_1.PlaceOrderTransactionService(options);
        }
        transaction.placeOrder = placeOrder;
    })(transaction = service.transaction || (service.transaction = {}));
})(service = exports.service || (exports.service = {}));
