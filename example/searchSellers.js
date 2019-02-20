/**
 * 販売者検索サンプル
 */
const sasaki = require('../lib/index');

async function main() {
    const auth = new sasaki.auth.ClientCredentials({
        domain: process.env.TEST_AUTHORIZE_SERVER_DOMAIN,
        clientId: process.env.TEST_CLIENT_ID,
        clientSecret: process.env.TEST_CLIENT_SECRET,
        scopes: [],
        state: 'teststate'
    });
    // const credentials = await auth.refreshAccessToken();
    // console.log('credentials:', credentials);

    const sellerService = new sasaki.service.Seller({
        endpoint: process.env.API_ENDPOINT,
        auth: auth
    });

    const sellers = await sellerService.search({
    });
    console.log('sellers are', sellers);
}

main().then(() => {
    console.log('main processed.');
}).catch((err) => {
    console.error(err);
});
