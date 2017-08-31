/**
 * event service test
 * @ignore
 */

import { OK } from 'http-status';
import * as nock from 'nock';
import * as assert from 'power-assert';

import * as sasaki from '../../lib/index';
import TestAuthClient from '../auth/testClient';

const API_ENDPOINT = 'https://sskts-api-development-preview.azurewebsites.net';

describe('event service', () => {
    let events: sasaki.service.Event;

    before(() => {
        nock.cleanAll();

        const auth = new TestAuthClient({ domain: '' });
        events = new sasaki.service.Event({
            auth: auth,
            endpoint: API_ENDPOINT
        });
    });

    beforeEach(() => {
        nock.cleanAll();
        nock.disableNetConnect();
    });

    it('上映イベント検索の結果が期待通り', async () => {
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

    it('identifierで上映イベント取得の結果が期待通り', async () => {
        const identifier = 'xxx';
        const data = {};
        const scope = nock(API_ENDPOINT, {
        })
            .get(`/events/individualScreeningEvent/${identifier}`)
            // .times(2)
            .reply(OK, { data: data });

        const result = await events.findIndividualScreeningEvent({
            identifier: identifier
        });
        assert.deepEqual(result, data);

        scope.done();
    });

    after(() => {
        nock.cleanAll();
        nock.enableNetConnect();
    });
});
