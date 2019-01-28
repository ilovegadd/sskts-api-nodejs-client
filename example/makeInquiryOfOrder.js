/**
 * a sample making inquiry of an order
 */
const readline = require('readline');
const sasaki = require('../lib/index');

async function main() {
    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout
    });

    const auth = new sasaki.auth.ClientCredentials({
        domain: process.env.TEST_AUTHORIZE_SERVER_DOMAIN,
        clientId: process.env.TEST_CLIENT_ID,
        clientSecret: process.env.TEST_CLIENT_SECRET,
        scopes: [],
        state: 'teststate'
    });

    // try to make inquiry in a few seconds
    console.log('making inquiry...');
    return new Promise((resolve, reject) => {
        rl.question('input theater code: ', (theaterCode) => {
            rl.question('input confirmation number: ', (confirmationNumber) => {
                rl.question('input telephone: ', async (telephone) => {
                    try {
                        const orders = new sasaki.service.Order({
                            endpoint: process.env.API_ENDPOINT,
                            auth: auth
                        });

                        const key = {
                            theaterCode: theaterCode,
                            confirmationNumber: parseInt(confirmationNumber, 10),
                            telephone: telephone
                        }

                        const orderByInquiry = await orders.findByOrderInquiryKey(key);
                        console.log('orderByInquiry:', orderByInquiry);

                        rl.close();
                        resolve();
                    } catch (error) {
                        rl.close();
                        reject(error);
                    }
                });
            });
        });
    });
}

exports.main = main;

main()
    .then(() => {
        console.log('main processed.');
    }).catch((err) => {
        console.error(err);
    });
