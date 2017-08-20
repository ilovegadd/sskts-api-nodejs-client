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
    getProfile(args) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield apiRequest_1.default({
                baseUrl: this.options.endpoint,
                uri: `/people/${args.personId}/profile`,
                auth: { bearer: yield this.options.auth.getAccessToken() },
                method: 'GET',
                expectedStatusCodes: [http_status_1.OK]
            });
        });
    }
    /**
     * プロフィール変更
     */
    updateProfile(args) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield apiRequest_1.default({
                baseUrl: this.options.endpoint,
                uri: `/people/${args.personId}/profile`,
                body: args.profile,
                auth: { bearer: yield this.options.auth.getAccessToken() },
                method: 'PUT',
                expectedStatusCodes: [http_status_1.NO_CONTENT]
            });
        });
    }
    /**
     * クレジットカード検索
     */
    findCreditCards(args) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield apiRequest_1.default({
                baseUrl: this.options.endpoint,
                uri: `/people/${args.personId}/creditCards`,
                auth: { bearer: yield this.options.auth.getAccessToken() },
                method: 'GET',
                expectedStatusCodes: [http_status_1.OK]
            });
        });
    }
    /**
     * クレジットカード追加
     */
    addCreditCard(args) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield apiRequest_1.default({
                baseUrl: this.options.endpoint,
                uri: `/people/${args.personId}/creditCards`,
                body: args.creditCard,
                auth: { bearer: yield this.options.auth.getAccessToken() },
                method: 'POST',
                expectedStatusCodes: [http_status_1.CREATED]
            });
        });
    }
}
exports.PersonService = PersonService;
