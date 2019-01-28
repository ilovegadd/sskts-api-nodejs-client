/**
 * 会員プログラム登録タスク作成サンプル
 */
const open = require('open');
const readline = require('readline');

const ssktsapi = require('../../lib/index');

async function main() {
    const auth = new ssktsapi.auth.OAuth2({
        domain: process.env.TEST_AUTHORIZE_SERVER_DOMAIN,
        clientId: process.env.TEST_CLIENT_ID_OAUTH2,
        clientSecret: process.env.TEST_CLIENT_SECRET_OAUTH2,
        redirectUri: 'https://localhost/signIn',
        logoutUri: 'https://localhost/signOut'
    });

    const state = '12345';
    const codeVerifier = '12345';

    const authUrl = auth.generateAuthUrl({
        scopes: [],
        state: state,
        codeVerifier: codeVerifier
    });
    console.log('authUrl:', authUrl);

    open(authUrl);

    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout
    });

    await new Promise((resolve, reject) => {
        rl.question('enter authorization code:\n', async (code) => {
            rl.question('enter state:\n', async (givenState) => {
                if (givenState !== state) {
                    reject(new Error('state not matched'));

                    return;
                }

                let credentials = await auth.getToken(code, codeVerifier);
                auth.setCredentials(credentials);
                rl.close();
                resolve();
            });
        });
    });

    const personService = new ssktsapi.service.Person({
        endpoint: process.env.API_ENDPOINT,
        auth: auth
    });

    const task = await personService.registerProgramMembership({
        personId: 'me',
        programMembershipId: '5afff104d51e59232c7b481b',
        offerIdentifier: 'AnnualPlan',
        sellerType: 'MovieTheater',
        sellerId: '59d20831e53ebc2b4e774466'
    });
    console.log('会員プログラム登録タスクが作成されました。', task.id);
}

main().then(async () => {
    console.log('main processed.');
}).catch((err) => {
    console.error(err);
});
