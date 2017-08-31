"use strict";
/**
 * event service test
 * @ignore
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
const nock = require("nock");
const assert = require("power-assert");
const sasaki = require("../../lib/index");
const testClient_1 = require("../auth/testClient");
const API_ENDPOINT = 'https://sskts-api-development-preview.azurewebsites.net';
describe('event service', () => {
    let events;
    before(() => {
        nock.cleanAll();
    });
    beforeEach(() => {
        nock.cleanAll();
        nock.disableNetConnect();
        const auth = new testClient_1.default({ domain: '' });
        events = sasaki.service.event({
            auth: auth,
            endpoint: API_ENDPOINT
        });
    });
    it('上映イベント検索', () => __awaiter(this, void 0, void 0, function* () {
        const scope = nock(API_ENDPOINT, {})
            .get(/^\/events\/individualScreeningEvent\?(.+)/)
            .reply(http_status_1.OK, { data: [] });
        const result = yield events.searchIndividualScreeningEvent({
            day: '',
            theater: ''
        });
        assert(Array.isArray(result));
        scope.done();
    }));
    it('identifierで上映イベント取得', () => __awaiter(this, void 0, void 0, function* () {
        const identifier = '123';
        const scope = nock(API_ENDPOINT, {})
            .get(`/events/individualScreeningEvent/${identifier}`)
            .reply(http_status_1.OK, { data: { identifier: identifier } });
        const result = yield events.findIndividualScreeningEvent({
            identifier: '123'
        });
        assert.equal(result.identifier, identifier);
        scope.done();
    }));
    after(() => {
        nock.cleanAll();
        nock.enableNetConnect();
    });
});
