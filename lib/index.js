"use strict";
/**
 * SSKTS API Node.js Client
 *
 * @ignore
 */
Object.defineProperty(exports, "__esModule", { value: true });
if (typeof process.env.SSKTS_OAUTH2_TOKEN_URL !== 'string' || process.env.SSKTS_OAUTH2_TOKEN_URL.length === 0) {
    throw new Error('NPM warnings. The environment variable "SSKTS_OAUTH2_TOKEN_URL" is required for using @motionpicture/sskts-api');
}
const clientCredentialsClient_1 = require("./auth/clientCredentialsClient");
const event_1 = require("./service/event");
const order_1 = require("./service/order");
const organization_1 = require("./service/organization");
const person_1 = require("./service/person");
const place_1 = require("./service/place");
const placeOrder_1 = require("./service/transaction/placeOrder");
var auth;
(function (auth) {
    /**
     * auth/ClientCredentials
     */
    class ClientCredentials extends clientCredentialsClient_1.default {
    }
    auth.ClientCredentials = ClientCredentials;
})(auth = exports.auth || (exports.auth = {}));
var service;
(function (service) {
    function event(options) {
        return new event_1.EventService(options);
    }
    service.event = event;
    function order(options) {
        return new order_1.OrderService(options);
    }
    service.order = order;
    function organization(options) {
        return new organization_1.OrganizationService(options);
    }
    service.organization = organization;
    function person(options) {
        return new person_1.PersonService(options);
    }
    service.person = person;
    function place(options) {
        return new place_1.PlaceService(options);
    }
    service.place = place;
    let transaction;
    (function (transaction) {
        function placeOrder(options) {
            return new placeOrder_1.PlaceOrderTransactionService(options);
        }
        transaction.placeOrder = placeOrder;
    })(transaction = service.transaction || (service.transaction = {}));
})(service = exports.service || (exports.service = {}));
