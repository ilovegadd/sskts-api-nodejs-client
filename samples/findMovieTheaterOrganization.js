/**
 * 枝番号で劇場組織取得サンプル
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

    // 劇場情報取得
    const movieTheater = await sskts.service.organization.findMovieTheaterByBranchCode({
        auth: auth,
        branchCode: '118'
    });
    debug('movieTheater is', movieTheater);
}

main().then(() => {
    debug('main processed.');
}).catch((err) => {
    console.error(err.message);
});
