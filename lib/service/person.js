"use strict";
/**
 * 人物サービス
 *
 * @namespace service.person
 */
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
const apiRequest_1 = require("../apiRequest");
const service_1 = require("../service");
class PersonService extends service_1.Service {
    /**
     * プロフィール取得
     */
    getProfile(params) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield apiRequest_1.default({
                auth: this.options.auth,
                baseUrl: this.options.endpoint,
                uri: `/people/${params.personId}/profile`,
                method: 'GET',
                expectedStatusCodes: [http_status_1.OK]
            });
        });
    }
    /**
     * プロフィール変更
     */
    updateProfile(params) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield apiRequest_1.default({
                auth: this.options.auth,
                baseUrl: this.options.endpoint,
                uri: `/people/${params.personId}/profile`,
                body: params.profile,
                method: 'PUT',
                expectedStatusCodes: [http_status_1.NO_CONTENT]
            });
        });
    }
    /**
     * クレジットカード検索
     */
    findCreditCards(params) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield apiRequest_1.default({
                auth: this.options.auth,
                baseUrl: this.options.endpoint,
                uri: `/people/${params.personId}/creditCards`,
                method: 'GET',
                expectedStatusCodes: [http_status_1.OK]
            });
        });
    }
    /**
     * クレジットカード追加
     */
    addCreditCard(params) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield apiRequest_1.default({
                auth: this.options.auth,
                baseUrl: this.options.endpoint,
                uri: `/people/${params.personId}/creditCards`,
                body: params.creditCard,
                method: 'POST',
                expectedStatusCodes: [http_status_1.CREATED]
            });
        });
    }
}
exports.PersonService = PersonService;
