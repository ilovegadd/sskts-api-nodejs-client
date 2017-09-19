/**
 * 上映イベント検索サンプル
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

    const individualScreeningEvents = await event.searchIndividualScreeningEvent({
        theater: '118',
        day: moment().format('YYYYMMDD')
    });
    debug('number of individualScreeningEvents is', individualScreeningEvents.length);
}

main().then(() => {
    debug('main processed.');
}).catch((err) => {
    console.error(err);
});
