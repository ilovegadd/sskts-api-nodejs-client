/**
 * 枝番号で劇場組織取得サンプル
 *
 * @ignore
 */

const debug = require('debug')('sasaki-api:samples');
const sasaki = require('../lib/index');

async function main() {
    const auth = new sasaki.auth.ClientCredentials({
        domain: process.env.TEST_AUTHORIZE_SERVER_DOMAIN,
        clientId: process.env.TEST_CLIENT_ID,
        clientSecret: process.env.TEST_CLIENT_SECRET,
        scopes: [
            'https://sskts-api-development.azurewebsites.net/organizations.read-only'
        ],
        state: 'teststate'
    });
    // const credentials = await auth.refreshAccessToken();
    // debug('credentials:', credentials);

    const organization = sasaki.service.organization({
        endpoint: process.env.SSKTS_API_ENDPOINT,
        auth: auth
    });

    // 劇場情報取得
    const movieTheater = await organization.findMovieTheaterByBranchCode({
        branchCode: '118'
    });
    debug('movieTheater is', movieTheater);
}

main().then(() => {
    debug('main processed.');
}).catch((err) => {
    console.error(err);
});
