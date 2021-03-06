/**
 * 注文検索サンプル
 */
const moment = require('moment');
const open = require('open');
const readline = require('readline');
const ssktsapi = require('../../lib/index');

const API_ENDPOINT = process.env.API_ENDPOINT

async function main() {

    const scopes = [];

    const auth = new ssktsapi.auth.OAuth2({
        domain: process.env.TEST_ADMIN_AUTHORIZE_SERVER_DOMAIN,
        clientId: process.env.TEST_ADMIN_CLIENT_ID,
        clientSecret: process.env.TEST_ADMIN_CLIENT_SECRET,
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

    const orderService = new ssktsapi.service.Order({
        endpoint: API_ENDPOINT,
        auth: auth
    });

    const { totalCount, data } = await orderService.search({
        confirmationNumbers: ['673392'],
        acceptedOffers: {
            itemOffered: {
                reservationFor: {
                    superEvent: {
                        location: {
                            branchCodes: ['118']
                        }
                    }
                }
            }
        }
    });
    console.log(totalCount, 'orders found.');
    console.log(data.length, 'orders returned.');
}

main().then(() => {
    console.log('success!');
}).catch(console.error);
