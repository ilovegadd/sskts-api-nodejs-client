/**
 * 注文照会サンプル
 *
 * @ignore
 */

const debug = require('debug')('sasaki-api:samples');
const sasaki = require('../../lib/index');

async function main() {
    const auth = new sasaki.auth.ClientCredentials({
        domain: 'sskts-development.auth.ap-northeast-1.amazoncognito.com',
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
        orderNumber: 3045,
        theaterCode: '118'
    });
    debug('order is', order);
}

main().then(() => {
    debug('main processed.');
}).catch((err) => {
    console.error(err.message);
});
