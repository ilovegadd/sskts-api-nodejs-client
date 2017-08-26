/**
 * a sample retrieving an access token
 */

const readline = require('readline');
const sasaki = require('../lib/index');

async function main() {
    const auth = new sasaki.auth.OAuth2({
        domain: 'sskts-development.auth.ap-northeast-1.amazoncognito.com',
        clientId: '2fi3iadm5se2j88g3837mdj9cj',
        clientSecret: '4tmmi5ul8vn1b8n8l7lh8ub2i4d8ig59pp3qkdqou0pjvu6pi17',
        redirectUri: 'https://localhost/signIn',
        // logoutUri?: string;
        // responseType?: string;
        // responseMode?: string;
        scopes: [
            'phone', 'openid', 'email', 'aws.cognito.signin.user.admin', 'profile',
            'https://sskts-api-development.azurewebsites.net/transactions',
            'https://sskts-api-development.azurewebsites.net/events.read-only',
            'https://sskts-api-development.azurewebsites.net/organizations.read-only',
            'https://sskts-api-development.azurewebsites.net/people.contacts',
            'https://sskts-api-development.azurewebsites.net/people.creditCards',
            'https://sskts-api-development.azurewebsites.net/people.ownershipInfos.read-only'
        ],
        state: '12345'
        // nonce?: string | null;
        // audience?: string;
        // tokenIssuer?: string;
    });

    const authUrl = auth.generateAuthUrl();
    console.log('authUrl:', authUrl);

    return new Promise(() => {
        const rl = readline.createInterface({
            input: process.stdin,
            output: process.stdout
        });

        rl.question('enter authorization code:\n', async (code) => {
            let credentials = await auth.getToken(code);
            console.log('credentials published', credentials);

            auth.setCredentials(credentials);

            credentials = auth.refreshAccessToken();
            console.log('credentials refreshed', credentials);

            rl.close();
            resolve();
        });
    });
}

main().then(() => {
    debug('main processed.');
}).catch((err) => {
    console.error(err.message);
});
