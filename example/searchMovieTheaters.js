/**
 * 劇場検索サンプル
 */
const sasaki = require('../lib/index');

async function main() {
    const auth = new sasaki.auth.ClientCredentials({
        domain: process.env.TEST_AUTHORIZE_SERVER_DOMAIN,
        clientId: process.env.TEST_CLIENT_ID,
        clientSecret: process.env.TEST_CLIENT_SECRET,
        scopes: [
            process.env.TEST_RESOURCE_IDENTIFIER + '/organizations.read-only'
        ],
        state: 'teststate'
    });
    // const credentials = await auth.refreshAccessToken();
    // console.log('credentials:', credentials);

    const organization = new sasaki.service.Organization({
        endpoint: process.env.API_ENDPOINT,
        auth: auth
    });

    const movieTheaters = await organization.searchMovieTheaters({
    });
    console.log('movieTheaters are', movieTheaters);
}

main().then(() => {
    console.log('main processed.');
}).catch((err) => {
    console.error(err);
});
