/**
 * index test
 * @ignore
 */

// import { OK } from 'http-status';
import * as nock from 'nock';
// import * as assert from 'power-assert';
// import * as qs from 'querystring';
// import * as url from 'url';
// import * as sasaki from '../../';

describe('OAuth2 client', () => {
    before(() => {
        nock.cleanAll();
    });

    beforeEach(() => {
        nock.cleanAll();
        nock.disableNetConnect();
    });

    after(() => {
        nock.cleanAll();
        nock.enableNetConnect();
    });
});
