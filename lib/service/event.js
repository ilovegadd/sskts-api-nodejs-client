"use strict";
/**
 * イベントサービス
 *
 * @namespace service.event
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
 * event service
 *
 * @class EventService
 */
class EventService extends service_1.Service {
    /**
     * 上映イベント検索
     */
    searchIndividualScreeningEvent(
        /**
         * 検索条件
         */
        params) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield apiRequest_1.default({
                baseUrl: this.options.endpoint,
                uri: '/events/individualScreeningEvent',
                auth: this.options.auth,
                method: 'GET',
                expectedStatusCodes: [http_status_1.OK],
                qs: params
            });
        });
    }
    /**
     * 上映イベント情報取得
     * 存在しなければnullを返します。
     */
    findIndividualScreeningEvent(params) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield apiRequest_1.default({
                baseUrl: this.options.endpoint,
                uri: `/events/individualScreeningEvent/${params.identifier}`,
                auth: this.options.auth,
                method: 'GET',
                expectedStatusCodes: [http_status_1.OK, http_status_1.NOT_FOUND]
            });
        });
    }
}
exports.EventService = EventService;
