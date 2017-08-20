"use strict";
/**
 * 注文取引サービス
 *
 * @namespace service.transaction.placeOrder
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
const apiRequest_1 = require("../../apiRequest");
const service_1 = require("../../service");
class PlaceOrderTransactionService extends service_1.Service {
    /**
     * 取引を開始する
     * 開始できない場合(混雑中など)、nullが返されます。
     */
    start(args) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield apiRequest_1.default({
                baseUrl: this.options.endpoint,
                uri: '/transactions/placeOrder/start',
                method: 'POST',
                expectedStatusCodes: [http_status_1.NOT_FOUND, http_status_1.OK],
                auth: { bearer: yield this.options.auth.getAccessToken() },
                body: {
                    expires: args.expires.valueOf(),
                    sellerId: args.sellerId
                }
            });
        });
    }
    /**
     * 取引に座席予約を追加する
     */
    createSeatReservationAuthorization(args) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield apiRequest_1.default({
                baseUrl: this.options.endpoint,
                uri: `/transactions/placeOrder/${args.transactionId}/seatReservationAuthorization`,
                method: 'POST',
                expectedStatusCodes: [http_status_1.CREATED],
                auth: { bearer: yield this.options.auth.getAccessToken() },
                body: {
                    eventIdentifier: args.eventIdentifier,
                    offers: args.offers
                }
            });
        });
    }
    /**
     * 座席予約取消
     */
    cancelSeatReservationAuthorization(args) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield apiRequest_1.default({
                baseUrl: this.options.endpoint,
                uri: `/transactions/placeOrder/${args.transactionId}/seatReservationAuthorization/${args.authorizationId}`,
                method: 'DELETE',
                expectedStatusCodes: [http_status_1.NO_CONTENT],
                auth: { bearer: yield this.options.auth.getAccessToken() }
            });
        });
    }
    /**
     * クレジットカードのオーソリを取得する
     */
    createCreditCardAuthorization(args) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield apiRequest_1.default({
                baseUrl: this.options.endpoint,
                uri: `/transactions/placeOrder/${args.transactionId}/paymentInfos/creditCard`,
                method: 'POST',
                expectedStatusCodes: [http_status_1.CREATED],
                auth: { bearer: yield this.options.auth.getAccessToken() },
                body: {
                    orderId: args.orderId,
                    amount: args.amount,
                    method: args.method,
                    creditCard: args.creditCard
                }
            });
        });
    }
    /**
     * クレジットカードオーソリ取消
     */
    cancelCreditCardAuthorization(args) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield apiRequest_1.default({
                baseUrl: this.options.endpoint,
                uri: `/transactions/placeOrder/${args.transactionId}/paymentInfos/creditCard/${args.authorizationId}`,
                method: 'DELETE',
                expectedStatusCodes: [http_status_1.NO_CONTENT],
                auth: { bearer: yield this.options.auth.getAccessToken() }
            });
        });
    }
    /**
     * 決済方法として、ムビチケを追加する
     */
    createMvtkAuthorization(args) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield apiRequest_1.default({
                baseUrl: this.options.endpoint,
                uri: `/transactions/placeOrder/${args.transactionId}/paymentInfos/mvtk`,
                method: 'POST',
                expectedStatusCodes: [http_status_1.CREATED],
                auth: { bearer: yield this.options.auth.getAccessToken() },
                body: args.mvtk
            });
        });
    }
    /**
     * ムビチケ取消
     */
    cancelMvtkAuthorization(args) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield apiRequest_1.default({
                baseUrl: this.options.endpoint,
                uri: `/transactions/placeOrder/${args.transactionId}/paymentInfos/mvtk/${args.authorizationId}`,
                method: 'DELETE',
                expectedStatusCodes: [http_status_1.NO_CONTENT],
                auth: { bearer: yield this.options.auth.getAccessToken() }
            });
        });
    }
    /**
     * 購入者情報登録
     */
    setAgentProfile(args) {
        return __awaiter(this, void 0, void 0, function* () {
            yield apiRequest_1.default({
                baseUrl: this.options.endpoint,
                uri: `/transactions/placeOrder/${args.transactionId}/agent/profile`,
                method: 'PUT',
                expectedStatusCodes: [http_status_1.NO_CONTENT],
                auth: { bearer: yield this.options.auth.getAccessToken() },
                body: args.profile
            });
        });
    }
    /**
     * 取引確定
     */
    confirm(args) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield apiRequest_1.default({
                baseUrl: this.options.endpoint,
                uri: `/transactions/placeOrder/${args.transactionId}/confirm`,
                method: 'POST',
                expectedStatusCodes: [http_status_1.CREATED],
                auth: { bearer: yield this.options.auth.getAccessToken() }
            });
        });
    }
    /**
     * 確定した取引に関して、購入者にメール通知を送信する
     */
    sendEmailNotification(args) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield apiRequest_1.default({
                baseUrl: this.options.endpoint,
                uri: `/transactions/placeOrder/${args.transactionId}/tasks/sendEmailNotification`,
                method: 'POST',
                expectedStatusCodes: [http_status_1.NO_CONTENT],
                auth: { bearer: yield this.options.auth.getAccessToken() },
                body: args.emailNotification
            });
        });
    }
}
exports.PlaceOrderTransactionService = PlaceOrderTransactionService;
