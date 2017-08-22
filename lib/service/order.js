"use strict";
/**
 * 注文サービス
 *
 * @namespace service.order
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
/**
 * order service
 *
 * @class OrderService
 */
class OrderService extends service_1.Service {
    /**
     * 照会キーで注文情報を取得する
     * 存在しなければnullを返します。
     */
    findByOrderInquiryKey(
        /**
         * 注文照会キー
         */
        params) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield apiRequest_1.default({
                auth: this.options.auth,
                baseUrl: this.options.endpoint,
                uri: '/orders/findByOrderInquiryKey',
                method: 'POST',
                expectedStatusCodes: [http_status_1.NOT_FOUND, http_status_1.OK],
                body: params
            });
        });
    }
}
exports.OrderService = OrderService;
