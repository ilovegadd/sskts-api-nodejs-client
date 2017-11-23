/**
 * 注文照会サンプル
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
            process.env.TEST_RESOURCE_IDENTIFIER + '/orders.read-only'
        ],
        state: 'teststate'
    });

    const orderService = sasaki.service.order({
        endpoint: process.env.SSKTS_API_ENDPOINT,
        auth: auth
    });

    const order = await orderService.findByOrderInquiryKey({
        telephone: '09000000000',
        confirmationNumber: 466,
        theaterCode: '112'
    });
    console.log('order is', order);
}

main().then(() => {
    console.log('main processed.');
}).catch((err) => {
    console.error(err);
});
