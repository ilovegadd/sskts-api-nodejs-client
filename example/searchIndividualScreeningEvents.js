/**
 * 上映イベント検索サンプル
 * @ignore
 */

const moment = require('moment');
const sasaki = require('../lib/index');

async function main() {
    const auth = new sasaki.auth.ClientCredentials({
        domain: process.env.TEST_AUTHORIZE_SERVER_DOMAIN,
        clientId: process.env.TEST_CLIENT_ID,
        clientSecret: process.env.TEST_CLIENT_SECRET,
        scopes: [
            process.env.TEST_RESOURCE_IDENTIFIER + '/events.read-only'
        ],
        state: 'teststate'
    });

    const event = sasaki.service.event({
        endpoint: process.env.SSKTS_API_ENDPOINT,
        auth: auth
    });

    const individualScreeningEvents = await event.searchIndividualScreeningEvent({
        theater: '118',
        startFrom: moment().add(1, 'day').toDate(),
        startThrough: moment().add(2, 'day').toDate()
    });
    // console.log('individualScreeningEvents are', individualScreeningEvents);
    console.log('number of individualScreeningEvents is', individualScreeningEvents.length);
}

main().then(() => {
    console.log('main processed.');
}).catch((err) => {
    console.error(err);
});
