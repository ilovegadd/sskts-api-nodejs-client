/**
 * 口座を扱うサンプル
 */
const open = require('open');
const readline = require('readline');
const client = require('../../lib/');

async function main() {
    const scopes = [];

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

    const ownershipInfoService = new client.service.person.OwnershipInfo({
        endpoint: process.env.API_ENDPOINT,
        auth: auth
    });

    // console.log('口座を開設します...');
    // const accountOwnershipInfo = await ownershipInfoService.openAccount({
    //     name: 'Account Name',
    //     accountType: client.factory.accountType.Point
    // });
    // console.log('口座を開設しました。', accountOwnershipInfo);

    // const account = accountOwnershipInfo.typeOfGood;

    // console.log('口座を解約します...');
    // await ownershipInfoService.closeAccount({
    //     accountType: account.accountType,
    //     accountNumber: account.accountNumber
    // });
    // console.log('口座を解約しました。');

    console.log('口座を検索します...');
    const searchAccountOwnershipInfosResults = await ownershipInfoService.search({
        typeOfGood: {
            typeOf: client.factory.ownershipInfo.AccountGoodType.Account,
            accountType: client.factory.accountType.Point
        }
    });
    console.log(searchAccountOwnershipInfosResults.totalCount, '件の口座がみつかりました。');
    console.log(searchAccountOwnershipInfosResults.data.filter((a) => a.typeOfGood.status === client.factory.pecorino.accountStatusType.Opened).length, '件の口座が開設中です。');

    const primaryAccount = searchAccountOwnershipInfosResults.data[0].typeOfGood;

    console.log('口座の取引履歴を検索します...', primaryAccount.accountNumber);
    const searchActionsResult = await ownershipInfoService.searchAccountMoneyTransferActions({
        limit: 5,
        page: 1,
        sort: { endDate: client.factory.pecorino.sortType.Descending },
        accountType: primaryAccount.accountType,
        accountNumber: primaryAccount.accountNumber
    });
    console.log(searchActionsResult);
    console.log(searchActionsResult.totalCount, '件の取引がみつかりました。');
}

main().then(() => {
    console.log('main processed.');
}).catch(console.error);
