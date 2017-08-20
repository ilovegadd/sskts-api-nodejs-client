/**
 * 劇場取得サンプル
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
            'https://sskts-api-development.azurewebsites.net/places.read-only'
        ]
    );

    const place = sskts.service.place({
        endpoint: process.env.SSKTS_API_ENDPOINT,
        auth: auth
    });

    // 劇場情報取得
    const movieTheater = await place.findMovieTheater({
        branchCode: '118'
    });
    debug('movieTheater is', movieTheater);
}

main().then(() => {
    debug('main processed.');
}).catch((err) => {
    console.error(err.message);
});
