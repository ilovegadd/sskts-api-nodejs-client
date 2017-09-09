/**
 * a sample keeping processing placeOrder transaction
 *
 * @ignore
 */

const readline = require('readline');

const sasaki = require('../../lib/index');
const processPlaceOrder = require('./processPlaceOrder');

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

rl.question('set intervals in milliseconds (example: 1000):\n', async (intervals) => {
    setInterval(
        async () => {
            try {
                const order = await processPlaceOrder.main();
                console.log(`
=============================== Transaction result ===============================
orderNumber  : ${order.orderNumber}
orderDate    : ${order.orderDate.toString()}
=============================== Transaction result ===============================`
                );
            } catch (error) {
                console.error(error);
            }
        },
        intervals
    );
});
