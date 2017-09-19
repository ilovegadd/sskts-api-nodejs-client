/**
 * 注文照会サンプル
 *
 * @ignore
 */

const debug = require('debug')('sskts-api-nodejs-client:samples');
const sasaki = require('../../lib/index');

async function main() {
    const auth = new sasaki.auth.ClientCredentials({
        domain: process.env.TEST_AUTHORIZE_SERVER_DOMAIN,
        clientId: process.env.TEST_CLIENT_ID,
        clientSecret: process.env.TEST_CLIENT_SECRET,
        scopes: [
            'https://sskts-api-development.azurewebsites.net/orders.read-only'
        ],
        state: 'teststate'
    });
    // const credentials = await auth.refreshAccessToken();
    // debug('credentials:', credentials);

    const orderService = sasaki.service.order({
        endpoint: process.env.SSKTS_API_ENDPOINT,
        auth: auth
    });

    const order = await orderService.findByOrderInquiryKey({
        telephone: '09012345678',
        confirmationNumber: 18100,
        theaterCode: '118'
    });
    debug('order is', order);
}

main().then(() => {
    debug('main processed.');
}).catch((err) => {
    console.error(err.message);
});
