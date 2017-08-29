/**
 * a sample making inquiry of an order
 *
 * @ignore
 */

const debug = require('debug')('sasaki-api:samples');
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
        scopes: [
            'https://sskts-api-development.azurewebsites.net/orders.read-only'
        ],
        state: 'teststate'
    });

    // try to make inquiry in a few seconds
    debug('making inquiry...');
    return new Promise((resolve, reject) => {
        rl.question('input theater code: ', (theaterCode) => {
            rl.question('input confirmation number: ', (confirmationNumber) => {
                rl.question('input telephone: ', async (telephone) => {
                    try {
                        const orders = sasaki.service.order({
                            endpoint: process.env.SSKTS_API_ENDPOINT,
                            auth: auth
                        });

                        const key = {
                            theaterCode: theaterCode,
                            confirmationNumber: parseInt(confirmationNumber, 10),
                            telephone: telephone
                        }

                        const orderByInquiry = await orders.findByOrderInquiryKey(key);
                        debug('orderByInquiry:', orderByInquiry);

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
