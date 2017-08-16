/**
 * 注文照会サンプル
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
            'https://sskts-api-development.azurewebsites.net/orders.read-only'
        ]
    );
    const credentials = await auth.refreshAccessToken();
    debug('credentials:', credentials);

    const order = await sskts.service.order.findByOrderInquiryKey({
        auth: auth,
        orderInquiryKey: {
            telephone: '09012345678',
            orderNumber: 3045,
            theaterCode: '118'
        }
    });
    debug('order is', order);
}

main().then(() => {
    debug('main processed.');
}).catch((err) => {
    console.error(err.message);
});
