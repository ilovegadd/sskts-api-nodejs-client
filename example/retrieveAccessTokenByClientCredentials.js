/**
 * アクセストークン発行サンプル
 */
const ssktsapi = require('../lib/index');

async function main() {
    const auth = new ssktsapi.auth.ClientCredentials({
        domain: process.env.TEST_AUTHORIZE_SERVER_DOMAIN,
        clientId: process.env.TEST_CLIENT_ID,
        clientSecret: process.env.TEST_CLIENT_SECRET,
        scopes: [],
        state: 'state'
    });
    const credentials = await auth.getToken();
    console.log('credentials published', credentials);
}

main().then(() => {
    console.log('main processed.');
}).catch((err) => {
    console.error(err);
});
