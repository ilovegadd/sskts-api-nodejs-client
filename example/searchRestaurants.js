/**
 * レストラン検索サンプル
 * @ignore
 */

const debug = require('debug')('sskts-api-nodejs-client:samples');
const sasaki = require('../lib/index');

async function main() {
    const auth = new sasaki.auth.ClientCredentials({
        domain: process.env.TEST_AUTHORIZE_SERVER_DOMAIN,
        clientId: process.env.TEST_CLIENT_ID,
        clientSecret: process.env.TEST_CLIENT_SECRET,
        scopes: [],
        state: 'teststate'
    });

    const organization = new sasaki.service.Organization({
        endpoint: process.env.SSKTS_API_ENDPOINT,
        auth: auth
    });

    const restaurants = await organization.searchRestaurants({});
    debug('restaurants are', restaurants);
}

main().then(() => {
    debug('main processed.');
}).catch((err) => {
    console.error(err);
});
