/**
 * 注文返品プロセス
 */
const moment = require('moment');
const auth = require('../authAsAdmin');
const client = require('../../lib/index');

async function main() {
    // 管理者として操作する場合はこちら
    const authClient = await auth.login();
    await authClient.refreshAccessToken();
    const loginTicket = authClient.verifyIdToken({});
    console.log('username is', loginTicket.getUsername());

    // const authClient = new client.auth.ClientCredentials({
    //     domain: process.env.TEST_AUTHORIZE_SERVER_DOMAIN,
    //     clientId: process.env.TEST_CLIENT_ID,
    //     clientSecret: process.env.TEST_CLIENT_SECRET,
    //     scopes: [],
    //     state: ''
    // });

    const returnOrderService = new client.service.transaction.ReturnOrder({
        endpoint: process.env.API_ENDPOINT,
        auth: authClient
    });

    const transaction = await returnOrderService.start({
        expires: moment().add(10, 'minutes').toDate(),
        object: {
            order: {
                orderNumber: 'MO106-190102-000001'
                // customer: { telephone: '\\+819012345678' }
            }
        }
    });
    console.log('transaction started', transaction.id);

    console.log('confirming transaction...');
    await returnOrderService.confirm(transaction);
    console.log('transaction confirmed');
}

main().then(() => {
    console.log('success!');
}).catch(console.error);
