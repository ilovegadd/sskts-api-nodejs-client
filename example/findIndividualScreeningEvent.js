/**
 * 上映イベント情報取得サンプル
 *
 * @ignore
 */

const debug = require('debug')('sskts-api-nodejs-client:samples');
const moment = require('moment');
const sasaki = require('../lib/index');

async function main() {
    const auth = new sasaki.auth.ClientCredentials({
        domain: process.env.TEST_AUTHORIZE_SERVER_DOMAIN,
        clientId: process.env.TEST_CLIENT_ID,
        clientSecret: process.env.TEST_CLIENT_SECRET,
        scopes: [],
        state: 'teststate'
    });
    // const credentials = await auth.refreshAccessToken();
    // debug('credentials:', credentials);

    const eventService = new sasaki.service.Event({
        endpoint: process.env.API_ENDPOINT,
        auth: auth
    });

    // 上映イベント検索
    const individualScreeningEvents = await eventService.searchIndividualScreeningEvent({
        theater: '118',
        day: moment().format('YYYYMMDD')
    });

    // イベント情報取得
    const individualScreeningEvent = await eventService.findIndividualScreeningEvent({
        identifier: individualScreeningEvents[0].identifier
    });
    if (individualScreeningEvent === null) {
        debug('event not found');
    } else {
        debug('individualScreeningEvent is', individualScreeningEvent);
    }
}

main().then(() => {
    debug('main processed.');
}).catch((err) => {
    console.error(err);
});
