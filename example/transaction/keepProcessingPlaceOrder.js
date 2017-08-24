/**
 * a sample keeping processing placeOrder transaction
 *
 * @ignore
 */

const sasaki = require('../../lib/index');
const processPlaceOrder = require('./processPlaceOrder');

setInterval(
    async () => {
        try {
            await processPlaceOrder.main();
            console.log('order created');
        } catch (error) {
            console.error(error);
        }
    },
    1000
);
