/**
 * 口座入金サンプル
 */
const readline = require('readline');
const ssktsapi = require('../../lib/index');

async function main() {

    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout
    });

    const toAccountNumber = await new Promise((resolve) => {
        rl.question('入金先口座番号を入力してください:\n', async (toAccountNumber) => {
            rl.close();
            resolve(toAccountNumber);
        });
    });

    const auth = new ssktsapi.auth.ClientCredentials({
        domain: process.env.TEST_AUTHORIZE_SERVER_DOMAIN,
        clientId: process.env.TEST_CLIENT_ID,
        clientSecret: process.env.TEST_CLIENT_SECRET,
        scopes: [],
        state: 'state'
    });

    const accountService = new ssktsapi.service.Account({
        endpoint: process.env.SSKTS_API_ENDPOINT,
        auth: auth
    });

    const order = await accountService.deposit({
        recipient: {
            id: 'recipientId',
            name: 'recipientName',
            url: ''
        },
        toAccountNumber: toAccountNumber,
        amount: 1,
        notes: 'Deposit from samples'
    });
    console.log('入金処理が完了しました。');
}

main().then(() => {
    console.log('main processed.');
}).catch((err) => {
    console.error(err);
});
