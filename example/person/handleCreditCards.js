/**
 * クレジットカードを扱うサンプル
 */
const COA = require('@motionpicture/coa-service');
const GMO = require('@motionpicture/gmo-service');
const moment = require('moment');
const open = require('open');
const readline = require('readline');
const util = require('util');

const client = require('../../lib/index');

async function main() {
    const auth = new client.auth.OAuth2({
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
                console.log('credentials published', credentials);

                auth.setCredentials(credentials);

                resolve();
            });
        });
    });

    const ownershipInfoService = new client.service.person.OwnershipInfo({
        endpoint: process.env.API_ENDPOINT,
        auth: auth
    });

    // クレジットカード検索
    let creditCards = await ownershipInfoService.searchCreditCards({});
    console.log(creditCards);
    console.log(creditCards.length, 'creditCards found.');

    // クレジットカード追加
    const creditCard = await ownershipInfoService.addCreditCard({
        creditCard: {
            cardNo: '4111111111111111',
            expire: '2024',
            securityCode: '123'
        }
    });
    console.log('creditCard added.', creditCard.cardSeq);

    // クレジットカード削除
    await ownershipInfoService.deleteCreditCard({
        cardSeq: creditCard.cardSeq
    });
    console.log('creditCard deleted.');

    // クレジットカード検索
    creditCards = await ownershipInfoService.searchCreditCards({});
    console.log(creditCards.length, 'creditCards found.');

    rl.close();
}

main().then(async () => {
    console.log('main processed.');
}).catch((err) => {
    console.error(err);
});
