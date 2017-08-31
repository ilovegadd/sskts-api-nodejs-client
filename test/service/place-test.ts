/**
 * place service test
 * @ignore
 */

import { OK } from 'http-status';
import * as nock from 'nock';
import * as assert from 'power-assert';

import * as sasaki from '../../lib/index';
import TestAuthClient from '../auth/testClient';

const API_ENDPOINT = 'https://sskts-api-development-preview.azurewebsites.net';

describe('place service', () => {
    let places: sasaki.service.Place;

    before(() => {
        nock.cleanAll();

        const auth = new TestAuthClient({ domain: '' });
        places = new sasaki.service.Place({
            auth: auth,
            endpoint: API_ENDPOINT
        });
    });

    beforeEach(() => {
        nock.cleanAll();
        nock.disableNetConnect();
    });

    it('劇場検索の結果が期待通り', async () => {
        const data: any[] = [];
        const scope = nock(API_ENDPOINT, {})
            .get(/\/places\/movieTheater[^?(.+)]*/)
            .reply(OK, { data: data });

        const result = await places.searchMovieTheaters({
        });
        assert.deepEqual(result, data);

        scope.done();
    });

    it('枝番号で劇場情報取得の結果が期待通り', async () => {
        const data = {
            branchCode: 'xxx'
        };
        const scope = nock(API_ENDPOINT, {})
            .get(`/places/movieTheater/${data.branchCode}`)
            .reply(OK, { data: data });

        const result = await places.findMovieTheater({
            branchCode: data.branchCode
        });
        assert.deepEqual(result, data);

        scope.done();
    });

    after(() => {
        nock.cleanAll();
        nock.enableNetConnect();
    });
});
