/**
 * 口座開設サンプル
 * @ignore
 */
const moment = require('moment');
const open = require('open');
const readline = require('readline');
const util = require('util');
const ssktsapi = require('../../lib/');

async function main() {
    const scopes = [];

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
        scopes: scopes,
        state: state,
        codeVerifier: codeVerifier
    });
    console.log('authUrl:', authUrl);

    open(authUrl);

    await new Promise((resolve, reject) => {
        const rl = readline.createInterface({
            input: process.stdin,
            output: process.stdout
        });

        rl.question('enter authorization code:\n', async (code) => {
            rl.question('enter state:\n', async (givenState) => {
                if (givenState !== state) {
                    reject(new Error('state not matched'));

                    return;
                }

                let credentials = await auth.getToken(code, codeVerifier);
                console.log('credentials published', credentials);

                auth.setCredentials(credentials);

                rl.close();
                resolve();
            });
        });
    });

    const logoutUrl = auth.generateLogoutUrl();
    console.log('logoutUrl:', logoutUrl);

    const personService = new ssktsapi.service.Person({
        endpoint: process.env.SSKTS_API_ENDPOINT,
        auth: auth
    });
    console.log('口座を開設します...');
    const account = await personService.openAccount({
        personId: 'me',
        name: 'Account Name'
    });
    console.log('口座を開設しました。', account.accountNumber);

    console.log('口座を解約します...');
    await personService.closeAccount({
        personId: 'me',
        accountNumber: account.accountNumber
    });
    console.log('口座を解約しました。');

    console.log('口座を検索します...');
    const accounts = await personService.findAccounts({ personId: 'me' });
    console.log(accounts.length, '件の口座がみつかりました。');
    console.log(accounts.filter((a) => a.status === ssktsapi.factory.pecorino.accountStatusType.Opened).length, '件の口座が開設中です。');
}

main().then(() => {
    console.log('main processed.');
}).catch(console.error);
