/**
 * a sample keeping processing placeOrder transaction
 *
 * @ignore
 */

const readline = require('readline');
const sskts = require('@motionpicture/sskts-domain');
const json2csv = require('json2csv');

const processPlaceOrder = require('./processPlaceOrder');

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

let logs = [];
let results = [];
let numberOfProcesses = 0;
let configurations = {
    numberOfTrials: 10,
    intervals: 1000
}

rl.question('set intervals in milliseconds (example: 1000):\n', async (intervals) => {
    configurations.intervals = intervals;
    rl.question('set number of trials:\n', async (numberOfTrials) => {
        configurations.numberOfTrials = numberOfTrials;
        const timer = setInterval(
            async () => {
                if (numberOfProcesses >= configurations.numberOfTrials) {
                    clearTimeout(timer);
                    rl.close();

                    return;
                }

                numberOfProcesses += 1;
                const processNumber = numberOfProcesses;
                let log = '';
                let result;
                const now = new Date();

                try {
                    const { transaction, order, numberOfTryAuthorizeCreditCard } = await processPlaceOrder.main();
                    result = {
                        processNumber: processNumber,
                        transactionId: transaction.id,
                        startDate: now.toISOString(),
                        errorMessage: '',
                        errorName: '',
                        errorCode: '',
                        orderNumber: order.orderNumber,
                        orderDate: order.orderDate.toString(),
                        paymentMethod: order.paymentMethods[0].paymentMethod,
                        paymentMethodId: order.paymentMethods[0].paymentMethodId,
                        price: `${order.price.toString()} ${order.priceCurrency}`,
                        numberOfTryAuthorizeCreditCard: numberOfTryAuthorizeCreditCard.toString()
                    };
                } catch (error) {
                    result = {
                        processNumber: processNumber,
                        transactionId: '',
                        startDate: now.toISOString(),
                        errorMessage: error.message,
                        errorName: error.name,
                        errorCode: error.code,
                        orderNumber: '',
                        orderDate: '',
                        paymentMethod: '',
                        paymentMethodId: '',
                        price: '',
                        numberOfTryAuthorizeCreditCard: '',
                    };
                }

                log = `
=============================== Transaction result ===============================
processNumber                    : ${result.processNumber.toString()}
transactionId                    : ${result.transactionId}
startDate                        : ${result.startDate}
errorMessage                     : ${result.errorMessage}
errorName                        : ${result.errorName}
errorCode                        : ${result.errorCode}
orderNumber                      : ${result.orderNumber}
orderDate                        : ${result.orderDate}
paymentMethod                    : ${result.paymentMethod}
paymentMethodId                  : ${result.paymentMethodId}
price                            : ${result.price}
numberOfTryAuthorizeCreditCard   : ${result.numberOfTryAuthorizeCreditCard}
=============================== Transaction result ===============================`;
                console.log(log);
                logs.push(log);
                results.push(result);

                // 全プロセスが終了したらレポートを送信
                if (results.length === numberOfProcesses) {
                    await sendReport();
                }
            },
            configurations.intervals
        );
    });
});

async function sendReport() {
    console.log('sending a report...');

    // sort result
    results = results.sort((a, b) => (a.processNumber > b.processNumber) ? 1 : -1);

    // csv作成
    const fields = Object.keys(results[0]);
    const fieldNames = Object.keys(results[0]);
    const csv = json2csv({
        data: results,
        fields: fields,
        fieldNames: fieldNames,
        del: ','
    });

    // upload csv
    const url = await sskts.service.util.uploadFile('sskts-report-loadtest-placeOrderTransactions.csv', csv)();
    console.log('csv url:', url);

    const notification = sskts.factory.notification.email.create({
        id: 'id',
        data: {
            from: 'noreply@example.com',
            to: 'hello@motionpicture.jp',
            subject: 'Completion of sskts loadtest',
            content: `sskts loadtest completed.

configurations are below.
==============================================================
intervals: ${configurations.intervals}
number of trials: ${configurations.numberOfTrials.toString()}
==============================================================

Please check the csv report here.
${url}
    `
        }
    });
    await sskts.service.notification.sendEmail(notification)();
}
