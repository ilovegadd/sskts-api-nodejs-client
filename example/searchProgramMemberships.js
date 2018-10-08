/**
 * 会員プログラムを検索するサンプル
 * @ignore
 */
const moment = require('moment');
const open = require('open');
const readline = require('readline');
const ssktsapi = require('../lib/index');

const API_ENDPOINT = process.env.API_ENDPOINT

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

    const programMembershipService = new ssktsapi.service.ProgramMembership({
        endpoint: API_ENDPOINT,
        auth: auth
    });

    // どんな会員プログラムがあるか検索する
    const programMemberships = await programMembershipService.search({});
    console.log(programMemberships.length, 'programMemberships found.');
}

main().then(() => {
    console.log('success!');
}).catch(console.error);
