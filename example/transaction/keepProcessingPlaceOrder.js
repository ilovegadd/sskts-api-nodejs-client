/**
 * a sample keeping processing placeOrder transaction
 * @ignore
 */

const readline = require('readline');
const sskts = require('@motionpicture/sskts-domain');
const json2csv = require('json2csv');
const request = require('request');

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
    intervals: 1000,
    apiEndpoint: process.env.SSKTS_API_ENDPOINT
};
const theaterCodes = ['112', '118'];

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

                const theaterCode = theaterCodes[Math.floor(theaterCodes.length * Math.random())];

                try {
                    const { transaction, order, numberOfTryAuthorizeCreditCard } = await processPlaceOrder.main(theaterCode);
                    result = {
                        processNumber: processNumber,
                        transactionId: transaction.id,
                        startDate: now.toISOString(),
                        errorMessage: '',
                        errorStack: '',
                        errorName: '',
                        errorCode: '',
                        orderNumber: order.orderNumber,
                        orderDate: order.orderDate.toString(),
                        paymentMethod: order.paymentMethods.map((paymentMethod) => paymentMethod.name).join(','),
                        paymentMethodId: order.paymentMethods.map((paymentMethod) => paymentMethod.paymentMethodId).join(','),
                        price: `${order.price.toString()} ${order.priceCurrency}`,
                        numberOfTryAuthorizeCreditCard: numberOfTryAuthorizeCreditCard.toString()
                    };
                } catch (error) {
                    result = {
                        processNumber: processNumber,
                        transactionId: '',
                        startDate: now.toISOString(),
                        errorMessage: error.message,
                        errorStack: error.stack,
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
errorStack                       : ${result.errorStack}
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

                // 全プロセスが終了したら
                // 取引に対するタスク状態確認
                // レポートを送信
                if (results.length === numberOfProcesses) {
                    await onAllProcessed();
                }
            },
            configurations.intervals
        );
    });
});

async function onAllProcessed() {
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
        del: ',',
        newLine: '\n',
        preserveNewLinesInValues: true
    });

    // upload csv
    const expiryDate = new Date();
    expiryDate.setDate(expiryDate.getDate() + 1);
    const url = await sskts.service.util.uploadFile({
        fileName: 'sskts-report-loadtest-placeOrderTransactions.csv',
        text: csv,
        expiryDate: expiryDate
    })();
    console.log('csv url:', url);

    const text = `## Completion of SSKTS placeOrder transaction loadtest
### Configurations
key  | value
------------- | -------------
intervals  | ${configurations.intervals}
number of trials  | ${configurations.numberOfTrials.toString()}
api endpoint  | ${configurations.apiEndpoint}
### Reports
- Please check out the csv report [here](${url}).
`;

    const emailMessage = sskts.factory.creativeWork.message.email.create({
        identifier: 'identifier',
        sender: {
            name: 'SSKTS Report',
            email: 'noreply@example.com'
        },
        toRecipient: {
            name: 'motionpicture developers',
            email: 'hello@motionpicture.jp'
        },
        about: 'Completion of SSKTS placeOrder transaction loadtest',
        text: text
    });

    await sskts.service.notification.sendEmail(emailMessage)();

    // backlogへ通知
    request.get(
        {
            url: `https://m-p.backlog.jp/api/v2/projects/SSKTS/users?apiKey=${process.env.BACKLOG_API_KEY}`,
            json: true
        },
        (error, response, body) => {
            const users = body;

            request.post(
                {
                    url: `https://m-p.backlog.jp/api/v2/issues/SSKTS-621/comments?apiKey=${process.env.BACKLOG_API_KEY}`,
                    form: {
                        content: text,
                        notifiedUserId: users.map((user) => user.id)
                    }
                },
                (error, response, body) => {
                    console.log('posted to backlog.', error);
                }
            );
        }
    );
}
