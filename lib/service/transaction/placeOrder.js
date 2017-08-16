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
/**
 * 取引を開始する
 * 開始できない場合(混雑中など)、nullが返されます。
 */
function start(args) {
    return __awaiter(this, void 0, void 0, function* () {
        return yield apiRequest_1.default({
            uri: '/transactions/placeOrder/start',
            method: 'POST',
            expectedStatusCodes: [http_status_1.NOT_FOUND, http_status_1.OK],
            auth: { bearer: yield args.auth.getAccessToken() },
            body: {
                expires: args.expires.valueOf(),
                sellerId: args.sellerId
            }
        });
    });
}
exports.start = start;
/**
 * 取引に座席予約を追加する
 */
function createSeatReservationAuthorization(args) {
    return __awaiter(this, void 0, void 0, function* () {
        return yield apiRequest_1.default({
            uri: `/transactions/placeOrder/${args.transactionId}/seatReservationAuthorization`,
            method: 'POST',
            expectedStatusCodes: [http_status_1.CREATED],
            auth: { bearer: yield args.auth.getAccessToken() },
            body: {
                eventIdentifier: args.eventIdentifier,
                offers: args.offers
            }
        });
    });
}
exports.createSeatReservationAuthorization = createSeatReservationAuthorization;
/**
 * 座席予約取消
 */
function cancelSeatReservationAuthorization(args) {
    return __awaiter(this, void 0, void 0, function* () {
        return yield apiRequest_1.default({
            uri: `/transactions/placeOrder/${args.transactionId}/seatReservationAuthorization/${args.authorizationId}`,
            method: 'DELETE',
            expectedStatusCodes: [http_status_1.NO_CONTENT],
            auth: { bearer: yield args.auth.getAccessToken() }
        });
    });
}
exports.cancelSeatReservationAuthorization = cancelSeatReservationAuthorization;
/**
 * クレジットカードのオーソリを取得する
 */
function createCreditCardAuthorization(args) {
    return __awaiter(this, void 0, void 0, function* () {
        return yield apiRequest_1.default({
            uri: `/transactions/placeOrder/${args.transactionId}/paymentInfos/creditCard`,
            method: 'POST',
            expectedStatusCodes: [http_status_1.CREATED],
            auth: { bearer: yield args.auth.getAccessToken() },
            body: {
                orderId: args.orderId,
                amount: args.amount,
                method: args.method,
                creditCard: args.creditCard
            }
        });
    });
}
exports.createCreditCardAuthorization = createCreditCardAuthorization;
/**
 * クレジットカードオーソリ取消
 */
function cancelCreditCardAuthorization(args) {
    return __awaiter(this, void 0, void 0, function* () {
        return yield apiRequest_1.default({
            uri: `/transactions/placeOrder/${args.transactionId}/paymentInfos/creditCard/${args.authorizationId}`,
            method: 'DELETE',
            expectedStatusCodes: [http_status_1.NO_CONTENT],
            auth: { bearer: yield args.auth.getAccessToken() }
        });
    });
}
exports.cancelCreditCardAuthorization = cancelCreditCardAuthorization;
/**
 * 決済方法として、ムビチケを追加する
 */
function createMvtkAuthorization(args) {
    return __awaiter(this, void 0, void 0, function* () {
        return yield apiRequest_1.default({
            uri: `/transactions/placeOrder/${args.transactionId}/paymentInfos/mvtk`,
            method: 'POST',
            expectedStatusCodes: [http_status_1.CREATED],
            auth: { bearer: yield args.auth.getAccessToken() },
            body: args.mvtk
        });
    });
}
exports.createMvtkAuthorization = createMvtkAuthorization;
/**
 * ムビチケ取消
 */
function cancelMvtkAuthorization(args) {
    return __awaiter(this, void 0, void 0, function* () {
        return yield apiRequest_1.default({
            uri: `/transactions/placeOrder/${args.transactionId}/paymentInfos/mvtk/${args.authorizationId}`,
            method: 'DELETE',
            expectedStatusCodes: [http_status_1.NO_CONTENT],
            auth: { bearer: yield args.auth.getAccessToken() }
        });
    });
}
exports.cancelMvtkAuthorization = cancelMvtkAuthorization;
/**
 * 購入者情報登録
 */
function setAgentProfile(args) {
    return __awaiter(this, void 0, void 0, function* () {
        yield apiRequest_1.default({
            uri: `/transactions/placeOrder/${args.transactionId}/agent/profile`,
            method: 'PUT',
            expectedStatusCodes: [http_status_1.NO_CONTENT],
            auth: { bearer: yield args.auth.getAccessToken() },
            body: args.profile
        });
    });
}
exports.setAgentProfile = setAgentProfile;
/**
 * 取引確定
 */
function confirm(args) {
    return __awaiter(this, void 0, void 0, function* () {
        return yield apiRequest_1.default({
            uri: `/transactions/placeOrder/${args.transactionId}/confirm`,
            method: 'POST',
            expectedStatusCodes: [http_status_1.CREATED],
            auth: { bearer: yield args.auth.getAccessToken() }
        });
    });
}
exports.confirm = confirm;
/**
 * 確定した取引に関して、購入者にメール通知を送信する
 */
function sendEmailNotification(args) {
    return __awaiter(this, void 0, void 0, function* () {
        return yield apiRequest_1.default({
            uri: `/transactions/placeOrder/${args.transactionId}/tasks/sendEmailNotification`,
            method: 'POST',
            expectedStatusCodes: [http_status_1.NO_CONTENT],
            auth: { bearer: yield args.auth.getAccessToken() },
            body: args.emailNotification
        });
    });
}
exports.sendEmailNotification = sendEmailNotification;
