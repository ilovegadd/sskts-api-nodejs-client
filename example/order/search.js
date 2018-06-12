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
        sellerIds: ['59d20831e53ebc2b4e774466'],
        // customerMembershipNumbers: ['yamazaki'],
        orderStatuses: [ssktsapi.factory.orderStatus.OrderDelivered],
        // orderNumber: 'MO118-180612-000063',
        orderNumbers: ['MO118-180612-000063'],
        orderDateFrom: moment().add(-3, 'days').toDate(),
        orderDateThrough: moment().toDate()
    });
    console.log(orders.length, 'orders found.');
}

main().then(() => {
    console.log('success!');
}).catch(console.error);
