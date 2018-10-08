/**
 * 取引履歴検索サンプル
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

                credentials = await auth.refreshAccessToken();
                console.log('credentials refreshed', credentials);

                rl.close();
                resolve();
            });
        });
    });

    const logoutUrl = auth.generateLogoutUrl();
    console.log('logoutUrl:', logoutUrl);

    const personService = new ssktsapi.service.Person({
        endpoint: process.env.API_ENDPOINT,
        auth: auth
    });
    const accounts = await personService.findAccounts({
        personId: 'me'
    });
    console.log(accounts.length, 'accounts found.');

    console.log('searching actions...account:', accounts[0].id);
    const actions = await personService.searchAccountMoneyTransferActions({
        personId: 'me',
        accountNumber: accounts.filter((a) => a.status === ssktsapi.factory.pecorino.accountStatusType.Opened)[0].accountNumber
    });
    console.log('取引履歴は以下の通りです。');
    console.log(actions.map((a) => {
        return util.format(
            '%s %s %s %s[%s] -> %s[%s] @%s',
            a.endDate,
            a.typeOf,
            a.amount,
            a.fromLocation.name,
            (a.fromLocation.id !== undefined) ? a.fromLocation.id : '',
            a.toLocation.name,
            (a.toLocation.id !== undefined) ? a.toLocation.id : '',
            a.purpose.typeOf
        );
    }).join('\n'));
}

main().then(() => {
    console.log('main processed.');
}).catch(console.error);
