/**
 * event service test
 * @ignore
 */

import { OK } from 'http-status';
import * as nock from 'nock';
import * as assert from 'power-assert';

import * as sasaki from '../../lib/index';
import { EventService } from '../../lib/service/event';
import TestAuthClient from '../auth/testClient';

const API_ENDPOINT = 'https://sskts-api-development-preview.azurewebsites.net';

describe('event service', () => {
    let events: EventService;

    before(() => {
        nock.cleanAll();
    });

    beforeEach(() => {
        nock.cleanAll();
        nock.disableNetConnect();

        const auth = new TestAuthClient({ domain: '' });
        events = sasaki.service.event({
            auth: auth,
            endpoint: API_ENDPOINT
        });
    });

    it('上映イベント検索', async () => {
        const scope = nock(API_ENDPOINT, {
        })
            .get(/^\/events\/individualScreeningEvent\?(.+)/)
            .reply(OK, { data: [] });

        const result = await events.searchIndividualScreeningEvent({
            day: '',
            theater: ''
        });
        assert(Array.isArray(result));

        scope.done();
    });

    it('identifierで上映イベント取得', async () => {
        const identifier = '123';
        const scope = nock(API_ENDPOINT, {
        })
            .get(`/events/individualScreeningEvent/${identifier}`)
            // .times(2)
            .reply(OK, { data: { identifier: identifier } });

        const result = await events.findIndividualScreeningEvent({
            identifier: '123'
        });
        assert.equal(result.identifier, identifier);

        scope.done();
    });

    after(() => {
        nock.cleanAll();
        nock.enableNetConnect();
    });
});
