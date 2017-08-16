/**
 * 上映イベント検索サンプル
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

    const individualScreeningEvents = await sskts.service.event.searchIndividualScreeningEvent({
        auth: auth,
        searchConditions: {
            theater: '118',
            day: moment().format('YYYYMMDD')
        }
    });
    debug('number of individualScreeningEvents is', individualScreeningEvents.length);
}

main().then(() => {
    debug('main processed.');
}).catch((err) => {
    console.error(err.message);
});
