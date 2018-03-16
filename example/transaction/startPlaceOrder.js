/**
 * 注文取引開始サンプル
 * @ignore
 */

const debug = require('debug')('sskts-api-nodejs-client:samples');
const moment = require('moment');
const sasaki = require('../../lib/index');

async function main() {
    const auth = new sasaki.auth.ClientCredentials({
        domain: process.env.TEST_AUTHORIZE_SERVER_DOMAIN,
        clientId: process.env.TEST_CLIENT_ID,
        clientSecret: process.env.TEST_CLIENT_SECRET,
        scopes: [],
        state: 'teststate'
    });

    const transactionService = new sasaki.service.transaction.PlaceOrder({
        endpoint: process.env.SSKTS_API_ENDPOINT,
        auth: auth
    });

    const transaction = await transactionService.start({
        expires: moment().add(15, 'minutes').toDate(),
        sellerId: '59d20831e53ebc2b4e774466'
    });
    debug('transaction started.', transaction);

    const menuItemAuthorization = await transactionService.createMenuItemAuthorization({
        transactionId: transaction.id,
        menuItemIdentifier: 'menuItemIdentifier',
        offerIdentifier: 'offerIdentifier'
    });
    debug('menu item authorized.', menuItemAuthorization);

    await wait(5000);

    await transactionService.createCreditCardAuthorization({
        transactionId: transaction.id,
        orderId: moment().format('YYYYMMDDHHmmss'),
        amount: 700,
        method: '1',
        creditCard: {
            cardNo: '4111111111111111',
            expire: '2012',
            holderName: 'AA BB'
        }
    });

    await transactionService.setCustomerContact({
        transactionId: transaction.id,
        contact: {
            givenName: 'たろう',
            familyName: 'もーしょん',
            telephone: '09012345678',
            email: process.env.SSKTS_DEVELOPER_EMAIL
        }
    });

    const order = await transactionService.confirm({
        transactionId: transaction.id
    });
    console.log('order created.', order);
}

async function wait(waitInMilliseconds) {
    return new Promise((resolve) => setTimeout(resolve, waitInMilliseconds));
}

main().then(() => {
    debug('main processed.');
}).catch((err) => {
    console.error(err);
});
