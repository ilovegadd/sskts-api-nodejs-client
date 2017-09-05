"use strict";
// tslint:disable:max-classes-per-file
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * sasaki API Node.js Client
 *
 * @ignore
 */
const sasaki = require("@motionpicture/sasaki-api-abstract");
const clientCredentialsClient_1 = require("./auth/clientCredentialsClient");
const oAuth2client_1 = require("./auth/oAuth2client");
/**
 * factory
 * All object interfaces are here.
 * 全てのオブジェクトのインターフェースはここに含まれます。
 * @export
 */
exports.factory = sasaki.factory;
exports.service = sasaki.service;
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
