/**
 * a sample keeping processing placeOrder transaction
 *
 * @ignore
 */

const readline = require('readline');
const sskts = require('@motionpicture/sskts-domain');

const processPlaceOrder = require('./processPlaceOrder');

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

let logs = [];
let numberOfProcesses = 0;

rl.question('set intervals in milliseconds (example: 1000):\n', async (intervals) => {
    rl.question('set number of trials:\n', async (numberOfTrials) => {
        const timer = setInterval(
            async () => {
                if (numberOfProcesses >= numberOfTrials) {
                    clearTimeout(timer);
                    rl.close();

                    return;
                }

                numberOfProcesses += 1;
                const processNumber = numberOfProcesses;
                let log = '';

                try {
                    const { order, numberOfTryAuthorizeCreditCard } = await processPlaceOrder.main();
                    log = `
=============================== Transaction result ===============================
processNumber                    : ${processNumber}
error.message                    :
error.name                       :
error.code                       :
orderNumber                      : ${order.orderNumber}
orderDate                        : ${order.orderDate.toString()}
paymentMethod                    : ${order.paymentMethods[0].paymentMethod}
paymentMethodId                  : ${order.paymentMethods[0].paymentMethodId}
price                            : ${order.price.toString()} ${order.priceCurrency}
numberOfTryAuthorizeCreditCard   : ${numberOfTryAuthorizeCreditCard.toString()}
=============================== Transaction result ===============================`;
                } catch (error) {
                    log = `
=============================== Transaction result ===============================
processNumber                    : ${processNumber}
error.message                    : ${error.message}
error.name                       : ${error.name}
error.code                       : ${error.code}
orderNumber                      :
orderDate                        :
paymentMethod                    :
paymentMethodId                  :
price                            :
numberOfTryAuthorizeCreditCard   :
=============================== Transaction result ===============================`
                        ;
                }

                console.log(log);
                logs.push(log);

                if (logs.length === numberOfProcesses) {
                    console.log('sending a report...');

                    const notification = sskts.factory.notification.email.create({
                        id: 'id',
                        data: {
                            from: 'noreply@example.com',
                            to: 'hello@motionpicture.jp',
                            subject: 'sskts-report-loadtest-placeOrderTransactions',
                            content: logs.join('')
                        }
                    });
                    await sskts.service.notification.sendEmail(notification)();
                }
            },
            intervals
        );
    });
});
