/**
 * 上映イベント情報取得サンプル
 *
 * @ignore
 */

const debug = require('debug')('sskts-api:samples');
const moment = require('moment');
const sskts = require('../lib/index');

async function main() {
    const auth = new sskts.auth.ClientCredentials(
        process.env.TEST_CLIENT_ID,
        process.env.TEST_CLIENT_SECRET,
        'teststate',
        [
            'https://sskts-api-development.azurewebsites.net/events.read-only'
        ]
    );
    const credentials = await auth.refreshAccessToken();
    debug('credentials:', credentials);

    // 上映イベント検索
    const individualScreeningEvents = await sskts.service.event.searchIndividualScreeningEvent({
        auth: auth,
        searchConditions: {
            theater: '118',
            day: moment().format('YYYYMMDD')
        }
    });

    // イベント情報取得
    const individualScreeningEvent = await sskts.service.event.findIndividualScreeningEvent({
        auth: auth,
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
    console.error(err.message);
});
