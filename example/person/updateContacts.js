/**
 * 連絡先更新サンプル
 */
const open = require('open');
const readline = require('readline');

const sasaki = require('../../lib/index');

async function main() {
    const scopes = [];

    const auth = new sasaki.auth.OAuth2({
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

    const people = new sasaki.service.Person({
        endpoint: process.env.API_ENDPOINT,
        auth: auth
    });

    // retrieve user's contacts
    const contacts = await people.getContacts({
        personId: 'me'
    });
    console.log('contacts:', contacts);

    await new Promise((resolve, reject) => {
        rl.question('enter email:\n', async (email) => {
            rl.question('enter phone number:\n', async (phoneNumber) => {
                rl.question('enter given name:\n', async (givenName) => {
                    rl.question('enter family name:\n', async (familyName) => {
                        try {
                            await people.updateContacts({
                                personId: 'me',
                                contacts: {
                                    givenName: givenName,
                                    familyName: familyName,
                                    telephone: phoneNumber,
                                    email: email
                                }
                            });

                            resolve();
                        } catch (error) {
                            reject(error);
                        }
                    });
                });
            });
        });
    });

    rl.close();
}

main().then(async () => {
    console.log('main processed.');
}).catch((err) => {
    console.error(err);
});
