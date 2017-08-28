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
 * event service
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
            return apiFetch_1.default({
                auth: this.options.auth,
                baseUrl: this.options.endpoint,
                uri: '/events/individualScreeningEvent',
                method: 'GET',
                qs: params,
                expectedStatusCodes: [http_status_1.OK]
            });
        });
    }
    /**
     * 上映イベント情報取得
     */
    findIndividualScreeningEvent(params) {
        return __awaiter(this, void 0, void 0, function* () {
            return apiFetch_1.default({
                auth: this.options.auth,
                baseUrl: this.options.endpoint,
                uri: `/events/individualScreeningEvent/${params.identifier}`,
                method: 'GET',
                expectedStatusCodes: [http_status_1.OK]
            });
        });
    }
}
exports.EventService = EventService;
