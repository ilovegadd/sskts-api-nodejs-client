"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const http_status_1 = require("http-status");
const apiFetch_1 = require("../apiFetch");
const service_1 = require("../service");
/**
 * person service
 *
 * @class PersonService
 */
class PersonService extends service_1.Service {
    /**
     * retrieve user contacts
     */
    getContacts(params) {
        return __awaiter(this, void 0, void 0, function* () {
            return apiFetch_1.default({
                auth: this.options.auth,
                baseUrl: this.options.endpoint,
                uri: `/people/${params.personId}/contacts`,
                method: 'GET',
                qs: {},
                expectedStatusCodes: [http_status_1.OK]
            });
        });
    }
    /**
     * update contacts
     */
    updateContacts(params) {
        return __awaiter(this, void 0, void 0, function* () {
            return apiFetch_1.default({
                auth: this.options.auth,
                baseUrl: this.options.endpoint,
                uri: `/people/${params.personId}/contacts`,
                method: 'PUT',
                body: params.contacts,
                expectedStatusCodes: [http_status_1.NO_CONTENT]
            });
        });
    }
    /**
     * find credit cards
     * クレジットカード検索
     * @see example /example/person/handleCreditCards
     */
    findCreditCards(params) {
        return __awaiter(this, void 0, void 0, function* () {
            return apiFetch_1.default({
                auth: this.options.auth,
                baseUrl: this.options.endpoint,
                uri: `/people/${params.personId}/creditCards`,
                method: 'GET',
                qs: {},
                expectedStatusCodes: [http_status_1.OK]
            });
        });
    }
    /**
     * add a credit card
     * クレジットカード追加
     * @return {Promise<ISearchCardResult>} successfully created credit card info
     * @see example /example/person/handleCreditCards
     */
    addCreditCard(params) {
        return __awaiter(this, void 0, void 0, function* () {
            return apiFetch_1.default({
                auth: this.options.auth,
                baseUrl: this.options.endpoint,
                uri: `/people/${params.personId}/creditCards`,
                method: 'POST',
                body: params.creditCard,
                expectedStatusCodes: [http_status_1.CREATED]
            });
        });
    }
    /**
     * delete a credit card by cardSeq
     * クレジットカード削除
     * @return {Promise<void>}
     * @see example /example/person/handleCreditCards
     */
    deleteCreditCard(params) {
        return __awaiter(this, void 0, void 0, function* () {
            return apiFetch_1.default({
                auth: this.options.auth,
                baseUrl: this.options.endpoint,
                uri: `/people/${params.personId}/creditCards/${params.cardSeq}`,
                method: 'DELETE',
                expectedStatusCodes: [http_status_1.NO_CONTENT]
            });
        });
    }
    /**
     * search ownerships of reservations
     */
    searchReservationOwnerships(params) {
        return __awaiter(this, void 0, void 0, function* () {
            return apiFetch_1.default({
                auth: this.options.auth,
                baseUrl: this.options.endpoint,
                uri: `/people/${params.personId}/ownershipInfos/reservation`,
                method: 'GET',
                qs: {},
                expectedStatusCodes: [http_status_1.OK]
            });
        });
    }
}
exports.PersonService = PersonService;
