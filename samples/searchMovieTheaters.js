/**
 * 劇場検索サンプル
 *
 * @ignore
 */

const debug = require('debug')('sskts-api:samples');
const sskts = require('../lib/index');

async function main() {
    const auth = new sskts.auth.ClientCredentials(
        process.env.TEST_CLIENT_ID,
        process.env.TEST_CLIENT_SECRET,
        'teststate',
        [
            'https://sskts-api-development.azurewebsites.net/organizations.read-only'
        ]
    );
    const credentials = await auth.refreshAccessToken();
    debug('credentials:', credentials);

    const organization = sskts.service.organization({
        endpoint: process.env.SSKTS_API_ENDPOINT,
        auth: auth
    });

    const movieTheaters = await organization.searchMovieTheaters({
    });
    debug('movieTheaters are', movieTheaters);
}

main().then(() => {
    debug('main processed.');
}).catch((err) => {
    console.error(err.message);
});
