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
const apiFetch_1 = require("../../apiFetch");
const service_1 = require("../../service");
/**
 * placeOrder transaction service
 *
 * @class PlaceOrderTransactionService
 */
class PlaceOrderTransactionService extends service_1.Service {
    /**
     * 取引を開始する
     * 開始できない場合(混雑中など)、nullが返されます。
     */
    start(params) {
        return __awaiter(this, void 0, void 0, function* () {
            return apiFetch_1.default({
                auth: this.options.auth,
                baseUrl: this.options.endpoint,
                uri: '/transactions/placeOrder/start',
                method: 'POST',
                body: {
                    // tslint:disable-next-line:no-magic-numbers
                    expires: (params.expires.getTime() / 1000).toFixed(0),
                    sellerId: params.sellerId
                },
                expectedStatusCodes: [http_status_1.OK]
            });
        });
    }
    /**
     * 取引に座席予約を追加する
     */
    createSeatReservationAuthorization(params) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield apiFetch_1.default({
                baseUrl: this.options.endpoint,
                uri: `/transactions/placeOrder/${params.transactionId}/seatReservationAuthorization`,
                method: 'POST',
                expectedStatusCodes: [http_status_1.CREATED],
                auth: this.options.auth,
                body: {
                    eventIdentifier: params.eventIdentifier,
                    offers: params.offers
                }
            });
        });
    }
    /**
     * 座席予約取消
     */
    cancelSeatReservationAuthorization(params) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield apiFetch_1.default({
                baseUrl: this.options.endpoint,
                uri: `/transactions/placeOrder/${params.transactionId}/seatReservationAuthorization/${params.authorizationId}`,
                method: 'DELETE',
                expectedStatusCodes: [http_status_1.NO_CONTENT],
                auth: this.options.auth
            });
        });
    }
    /**
     * クレジットカードのオーソリを取得する
     */
    createCreditCardAuthorization(params) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield apiFetch_1.default({
                baseUrl: this.options.endpoint,
                uri: `/transactions/placeOrder/${params.transactionId}/paymentInfos/creditCard`,
                method: 'POST',
                expectedStatusCodes: [http_status_1.CREATED],
                auth: this.options.auth,
                body: {
                    orderId: params.orderId,
                    amount: params.amount,
                    method: params.method,
                    creditCard: params.creditCard
                }
            });
        });
    }
    /**
     * クレジットカードオーソリ取消
     */
    cancelCreditCardAuthorization(params) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield apiFetch_1.default({
                baseUrl: this.options.endpoint,
                uri: `/transactions/placeOrder/${params.transactionId}/paymentInfos/creditCard/${params.authorizationId}`,
                method: 'DELETE',
                expectedStatusCodes: [http_status_1.NO_CONTENT],
                auth: this.options.auth
            });
        });
    }
    /**
     * 決済方法として、ムビチケを追加する
     */
    createMvtkAuthorization(params) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield apiFetch_1.default({
                baseUrl: this.options.endpoint,
                uri: `/transactions/placeOrder/${params.transactionId}/discountInfos/mvtk`,
                method: 'POST',
                expectedStatusCodes: [http_status_1.CREATED],
                auth: this.options.auth,
                body: params.mvtk
            });
        });
    }
    /**
     * ムビチケ取消
     */
    cancelMvtkAuthorization(params) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield apiFetch_1.default({
                baseUrl: this.options.endpoint,
                uri: `/transactions/placeOrder/${params.transactionId}/discountInfos/mvtk/${params.authorizationId}`,
                method: 'DELETE',
                expectedStatusCodes: [http_status_1.NO_CONTENT],
                auth: this.options.auth
            });
        });
    }
    /**
     * register a customer contact
     */
    setCustomerContact(params) {
        return __awaiter(this, void 0, void 0, function* () {
            yield apiFetch_1.default({
                baseUrl: this.options.endpoint,
                uri: `/transactions/placeOrder/${params.transactionId}/customerContact`,
                method: 'PUT',
                expectedStatusCodes: [http_status_1.NO_CONTENT],
                auth: this.options.auth,
                body: params.contact
            });
        });
    }
    /**
     * 取引確定
     */
    confirm(params) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield apiFetch_1.default({
                baseUrl: this.options.endpoint,
                uri: `/transactions/placeOrder/${params.transactionId}/confirm`,
                method: 'POST',
                expectedStatusCodes: [http_status_1.CREATED],
                auth: this.options.auth
            });
        });
    }
    /**
     * 確定した取引に関して、購入者にメール通知を送信する
     */
    sendEmailNotification(params) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield apiFetch_1.default({
                baseUrl: this.options.endpoint,
                uri: `/transactions/placeOrder/${params.transactionId}/tasks/sendEmailNotification`,
                method: 'POST',
                expectedStatusCodes: [http_status_1.NO_CONTENT],
                auth: this.options.auth,
                body: params.emailNotification
            });
        });
    }
}
exports.PlaceOrderTransactionService = PlaceOrderTransactionService;
