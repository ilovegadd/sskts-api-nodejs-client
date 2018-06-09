/**
 * 注文検索サンプル
 * @ignore
 */
const moment = require('moment');
const open = require('open');
const readline = require('readline');
const ssktsapi = require('../../lib/index');

const API_ENDPOINT = process.env.SSKTS_API_ENDPOINT

async function main() {
    const scopes = [];

    const auth = new ssktsapi.auth.ClientCredentials({
        domain: process.env.TEST_AUTHORIZE_SERVER_DOMAIN,
        clientId: process.env.TEST_CLIENT_ID,
        clientSecret: process.env.TEST_CLIENT_SECRET,
        scopes: scopes,
        state: '12345'
    });

    const orderService = new ssktsapi.service.Order({
        endpoint: API_ENDPOINT,
        auth: auth
    });

    const orders = await orderService.search({
        // sellerId: '59d20831e53ebc2b4e774466',
        // customerMembershipNumber: 'ilovegadd',
        orderNumber: 'MO118-180531-000003',
        orderDateFrom: moment().add(-3, 'days').toDate(),
        orderDateThrough: moment().toDate()
    });
    console.log(orders.length, 'orders found.');
}

main().then(() => {
    console.log('success!');
}).catch(console.error);
