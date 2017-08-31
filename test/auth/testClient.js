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
const oAuth2client_1 = require("../../lib/auth/oAuth2client");
/**
 * テストOAuthクライアント
 * @class TestClient
 */
class TestClient extends oAuth2client_1.default {
    constructor(options) {
        super(options);
        this.options = options;
        this.credentials = { refresh_token: 'ignored' };
    }
    // tslint:disable-next-line:prefer-function-over-method
    getToken() {
        return __awaiter(this, void 0, void 0, function* () {
            return {
                refresh_token: 'ignored',
                expiry_date: 4657740852,
                access_token: 'access_token',
                token_type: 'Bearer'
            };
        });
    }
    refreshToken(__) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.getToken();
        });
    }
}
exports.default = TestClient;
