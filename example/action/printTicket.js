/**
 * チケット印刷アクション追加サンプル
 * @ignore
 */

const debug = require('debug')('sskts-api-nodejs-client:samples');
const sasaki = require('../../');

async function main() {
    const auth = new sasaki.auth.ClientCredentials({
        domain: process.env.TEST_AUTHORIZE_SERVER_DOMAIN,
        clientId: process.env.TEST_CLIENT_ID,
        clientSecret: process.env.TEST_CLIENT_SECRET,
        scopes: [
            process.env.TEST_RESOURCE_IDENTIFIER + '/actions'
        ],
        state: 'teststate'
    });

    const actionService = new sasaki.service.Action({
        endpoint: process.env.SSKTS_API_ENDPOINT,
        auth: auth
    });

    const action = await actionService.printTicket({
        ticketToken: 'ticketToken'
    });
    debug('action created.', action);

    const actions = await actionService.searchPrintTicket({
        agentId: 'me',
        ticketToken: 'ticketToken'
    });
    debug('actions found.', actions);
}

main().then(() => {
    debug('main processed.');
}).catch((err) => {
    console.error(err.message);
});
