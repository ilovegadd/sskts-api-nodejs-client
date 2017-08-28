/**
 * 上映イベント情報取得サンプル
 *
 * @ignore
 */

const debug = require('debug')('sasaki-api:samples');
const moment = require('moment');
const sasaki = require('../lib/index');

async function main() {
    const auth = new sasaki.auth.ClientCredentials({
        domain: 'sskts-development.auth.ap-northeast-1.amazoncognito.com',
        clientId: process.env.TEST_CLIENT_ID,
        clientSecret: process.env.TEST_CLIENT_SECRET,
        scopes: [
            'https://sskts-api-development.azurewebsites.net/events.read-only'
        ],
        state: 'teststate'
    });
    // const credentials = await auth.refreshAccessToken();
    // debug('credentials:', credentials);

    const event = sasaki.service.event({
        endpoint: process.env.SSKTS_API_ENDPOINT,
        auth: auth
    });

    // 上映イベント検索
    const individualScreeningEvents = await event.searchIndividualScreeningEvent({
        theater: '118',
        day: moment().format('YYYYMMDD')
    });

    // イベント情報取得
    const individualScreeningEvent = await event.findIndividualScreeningEvent({
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
