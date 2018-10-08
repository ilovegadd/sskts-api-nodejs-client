/**
 * ユーザープール検索
 */
const auth = require('../authAsAdmin');
const client = require('../../lib/index');

async function main() {
    const authClient = await auth.login();
    await authClient.refreshAccessToken();
    const loginTicket = authClient.verifyIdToken({});
    console.log('username is', loginTicket.getUsername());

    const userPoolService = new client.service.UserPool({
        endpoint: process.env.API_ENDPOINT,
        auth: authClient
    });
    const userPool = await userPoolService.findById({
        userPoolId: 'ap-northeast-1_Zb9bVWg4H'
    });
    console.log(userPool);
}

main().then(() => {
    console.log('success!');
}).catch(console.error);
