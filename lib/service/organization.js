"use strict";
/**
 * 組織サービス
 *
 * @namespace service.organization
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
class OrganizationService extends service_1.Service {
    /**
     * 劇場組織検索
     */
    searchMovieTheaters(
        /**
         * 検索条件
         */
        searchConditions) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield apiRequest_1.default({
                baseUrl: this.options.endpoint,
                uri: '/organizations/movieTheater',
                method: 'GET',
                expectedStatusCodes: [http_status_1.OK],
                auth: { bearer: yield this.options.auth.getAccessToken() },
                qs: searchConditions
            });
        });
    }
    /**
     * 枝番号で劇場組織検索
     */
    findMovieTheaterByBranchCode(args) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield apiRequest_1.default({
                baseUrl: this.options.endpoint,
                uri: `/organizations/movieTheater/${args.branchCode}`,
                method: 'GET',
                expectedStatusCodes: [http_status_1.NOT_FOUND, http_status_1.OK],
                auth: { bearer: yield this.options.auth.getAccessToken() }
            });
        });
    }
}
exports.OrganizationService = OrganizationService;
