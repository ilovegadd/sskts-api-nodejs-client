/**
 * person service test
 * @ignore
 */

import { CREATED, NO_CONTENT, OK } from 'http-status';
import * as nock from 'nock';
import * as assert from 'power-assert';

import * as sasaki from '../../lib/index';
import TestAuthClient from '../auth/testClient';

const API_ENDPOINT = 'https://sskts-api-development-preview.azurewebsites.net';

describe('person service', () => {
    let people: sasaki.service.Person;

    before(() => {
        nock.cleanAll();

        const auth = new TestAuthClient({ domain: '' });
        people = new sasaki.service.Person({
            auth: auth,
            endpoint: API_ENDPOINT
        });
    });

    it('連絡先取得の結果が期待通り', async () => {
        const personId = 'me';
        const data = {
        };
        const scope = nock(API_ENDPOINT, {})
            .get(`/people/${personId}/contacts`)
            .reply(OK, { data: data });

        const result = await people.getContacts({
            personId: personId
        });
        assert.deepEqual(result, data);

        scope.done();
    });

    it('連絡先更新の結果が期待通り', async () => {
        const personId = 'me';
        const contacts = {
            givenName: 'xxx',
            familyName: 'xxx',
            telephone: 'xxx',
            email: 'xxx'
        };
        const data = {
        };
        const scope = nock(API_ENDPOINT, {})
            .put(`/people/${personId}/contacts`, contacts)
            .reply(NO_CONTENT);

        const result = await people.updateContacts({
            personId: personId,
            contacts: contacts
        });
        assert.deepEqual(result, undefined);

        scope.done();
    });

    it('クレジットカード検索の結果が期待通り', async () => {
        const personId = 'me';
        const data = {
        };
        const scope = nock(API_ENDPOINT, {})
            .get(`/people/${personId}/creditCards`)
            .reply(OK, { data: data });

        const result = await people.findCreditCards({
            personId: personId
        });
        assert.deepEqual(result, data);

        scope.done();
    });

    it('クレジットカード追加の結果が期待通り', async () => {
        const personId = 'me';
        const creditCard = <any>{};
        const data = {
        };
        const scope = nock(API_ENDPOINT, {})
            .post(`/people/${personId}/creditCards`, creditCard)
            .reply(CREATED, { data: data });

        const result = await people.addCreditCard({
            personId: personId,
            creditCard: creditCard
        });
        assert.deepEqual(result, data);

        scope.done();
    });

    it('クレジットカード削除の結果が期待通り', async () => {
        const personId = 'me';
        const cardSeq = 'xxx';
        const scope = nock(API_ENDPOINT, {})
            .delete(`/people/${personId}/creditCards/${cardSeq}`)
            .reply(NO_CONTENT);

        const result = await people.deleteCreditCard({
            personId: personId,
            cardSeq: cardSeq
        });
        assert.deepEqual(result, undefined);

        scope.done();
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
