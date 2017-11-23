/**
 * a sample processing placeOrder transaction
 *
 * @ignore
 */

const COA = require('@motionpicture/coa-service');
const GMO = require('@motionpicture/gmo-service');
const debug = require('debug')('sskts-api-nodejs-client:samples');
const moment = require('moment');
const util = require('util');

const sasaki = require('../../');
const makeInquiry = require('../makeInquiryOfOrder');

const auth = new sasaki.auth.ClientCredentials({
    domain: process.env.TEST_AUTHORIZE_SERVER_DOMAIN,
    clientId: process.env.TEST_CLIENT_ID,
    clientSecret: process.env.TEST_CLIENT_SECRET,
    scopes: [
        `${process.env.TEST_RESOURCE_SERVER_IDENTIFIER}/transactions`,
        `${process.env.TEST_RESOURCE_SERVER_IDENTIFIER}/events.read-only`,
        `${process.env.TEST_RESOURCE_SERVER_IDENTIFIER}/organizations.read-only`
    ],
    state: 'teststate'
});

const events = sasaki.service.event({
    endpoint: process.env.SSKTS_API_ENDPOINT,
    auth: auth
});

const organizations = sasaki.service.organization({
    endpoint: process.env.SSKTS_API_ENDPOINT,
    auth: auth
});

const placeOrderTransactions = sasaki.service.transaction.placeOrder({
    endpoint: process.env.SSKTS_API_ENDPOINT,
    auth: auth
});

async function main(theaterCode) {
    // search movie theater organizations
    const movieTheaterOrganization = await organizations.findMovieTheaterByBranchCode({
        branchCode: theaterCode
    });
    if (movieTheaterOrganization === null) {
        throw new Error('movie theater shop not open');
    }

    // search screening events
    const individualScreeningEvents = await events.searchIndividualScreeningEvent({
        superEventLocationIdentifiers: [movieTheaterOrganization.identifier],
        startFrom: moment().toISOString(),
        startThrough: moment().add(2, 'day').toISOString()
    });

    const availableEvents = individualScreeningEvents.filter((event) => event.offer.availability > 0);
    if (availableEvents.length === 0) {
        throw new Error('no available events');
    }

    await wait(5000);

    const availableEvent = availableEvents[Math.floor(availableEvents.length * Math.random())];

    // retrieve an event detail
    const individualScreeningEvent = await events.findIndividualScreeningEvent({
        identifier: availableEvent.identifier
    });
    if (individualScreeningEvent === null) {
        throw new Error('specified screening event not found');
    }

    const dateJouei = individualScreeningEvent.coaInfo.dateJouei;
    const titleCode = individualScreeningEvent.coaInfo.titleCode;
    const titleBranchNum = individualScreeningEvent.coaInfo.titleBranchNum;
    const timeBegin = individualScreeningEvent.coaInfo.timeBegin;
    const screenCode = individualScreeningEvent.coaInfo.screenCode;

    // start a transaction
    debug('starting a transaction...');
    const transaction = await placeOrderTransactions.start({
        expires: moment().add(10, 'minutes').toDate(),
        sellerId: movieTheaterOrganization.id
    });

    // search sales tickets from COA
    // このサンプルは1座席購入なので、制限単位が1枚以上の券種に絞る
    const salesTicketResult = await COA.services.reserve.salesTicket({
        theaterCode: theaterCode,
        dateJouei: dateJouei,
        titleCode: titleCode,
        titleBranchNum: titleBranchNum,
        timeBegin: timeBegin,
        flgMember: COA.services.reserve.FlgMember.NonMember
    }).then((results) => results.filter((result) => result.limitUnit === '001' && result.limitCount === 1));
    debug('salesTicketResult:', salesTicketResult);

    // search available seats from COA
    const getStateReserveSeatResult = await COA.services.reserve.stateReserveSeat({
        theaterCode: theaterCode,
        dateJouei: dateJouei,
        titleCode: titleCode,
        titleBranchNum: titleBranchNum,
        timeBegin: timeBegin,
        screenCode: screenCode
    });
    debug('getStateReserveSeatResult:', getStateReserveSeatResult);
    if (getStateReserveSeatResult.cntReserveFree <= 0) {
        throw new Error('no available seats');
    }
    const sectionCode = getStateReserveSeatResult.listSeat[0].seatSection;
    const freeSeatCodes = getStateReserveSeatResult.listSeat[0].listFreeSeat.map((freeSeat) => {
        return freeSeat.seatNum;
    });

    await wait(5000);

    // select a seat randomly
    const selectedSeatCode = freeSeatCodes[Math.floor(freeSeatCodes.length * Math.random())];

    // select a ticket randomly
    let selectedSalesTicket = salesTicketResult[Math.floor(salesTicketResult.length * Math.random())];

    debug('creating a seat reservation authorization...');
    let seatReservationAuthorization = await placeOrderTransactions.createSeatReservationAuthorization({
        transactionId: transaction.id,
        eventIdentifier: individualScreeningEvent.identifier,
        offers: [
            {
                seatSection: sectionCode,
                seatNumber: selectedSeatCode,
                ticketInfo: {
                    ticketCode: selectedSalesTicket.ticketCode,
                    ticketName: selectedSalesTicket.ticketName,
                    ticketNameEng: selectedSalesTicket.ticketNameEng,
                    ticketNameKana: selectedSalesTicket.ticketNameKana,
                    stdPrice: selectedSalesTicket.stdPrice,
                    addPrice: selectedSalesTicket.addPrice,
                    disPrice: 0,
                    salePrice: selectedSalesTicket.salePrice,
                    mvtkAppPrice: 0,
                    ticketCount: 1,
                    seatNum: selectedSeatCode,
                    addGlasses: selectedSalesTicket.addGlasses,
                    kbnEisyahousiki: '00',
                    mvtkNum: '',
                    mvtkKbnDenshiken: '00',
                    mvtkKbnMaeuriken: '00',
                    mvtkKbnKensyu: '00',
                    mvtkSalesPrice: 0
                }
            }
        ]
    });
    debug('seatReservationAuthorization:', seatReservationAuthorization);

    debug('canceling a seat reservation authorization...');
    await placeOrderTransactions.cancelSeatReservationAuthorization({
        transactionId: transaction.id,
        actionId: seatReservationAuthorization.id
    });

    await wait(1000);

    debug('recreating a seat reservation authorization...');
    seatReservationAuthorization = await placeOrderTransactions.createSeatReservationAuthorization({
        transactionId: transaction.id,
        eventIdentifier: individualScreeningEvent.identifier,
        offers: [
            {
                seatSection: sectionCode,
                seatNumber: selectedSeatCode,
                ticketInfo: {
                    ticketCode: selectedSalesTicket.ticketCode,
                    ticketName: selectedSalesTicket.ticketName,
                    ticketNameEng: selectedSalesTicket.ticketNameEng,
                    ticketNameKana: selectedSalesTicket.ticketNameKana,
                    stdPrice: selectedSalesTicket.stdPrice,
                    addPrice: selectedSalesTicket.addPrice,
                    disPrice: 0,
                    salePrice: selectedSalesTicket.salePrice,
                    mvtkAppPrice: 0,
                    ticketCount: 1,
                    seatNum: selectedSeatCode,
                    addGlasses: selectedSalesTicket.addGlasses,
                    kbnEisyahousiki: '00',
                    mvtkNum: '',
                    mvtkKbnDenshiken: '00',
                    mvtkKbnMaeuriken: '00',
                    mvtkKbnKensyu: '00',
                    mvtkSalesPrice: 0
                }
            }
        ]
    });
    debug('seatReservationAuthorization:', seatReservationAuthorization);

    await wait(5000);

    debug('券種を変更します...');
    // select a ticket randomly
    selectedSalesTicket = salesTicketResult[Math.floor(salesTicketResult.length * Math.random())];
    seatReservationAuthorization = await placeOrderTransactions.changeSeatReservationOffers({
        transactionId: transaction.id,
        actionId: seatReservationAuthorization.id,
        eventIdentifier: individualScreeningEvent.identifier,
        offers: [
            {
                seatSection: sectionCode,
                seatNumber: selectedSeatCode,
                ticketInfo: {
                    ticketCode: selectedSalesTicket.ticketCode,
                    ticketName: selectedSalesTicket.ticketName,
                    ticketNameEng: selectedSalesTicket.ticketNameEng,
                    ticketNameKana: selectedSalesTicket.ticketNameKana,
                    stdPrice: selectedSalesTicket.stdPrice,
                    addPrice: selectedSalesTicket.addPrice,
                    disPrice: 0,
                    salePrice: selectedSalesTicket.salePrice,
                    mvtkAppPrice: 0,
                    ticketCount: 1,
                    seatNum: selectedSeatCode,
                    addGlasses: selectedSalesTicket.addGlasses,
                    kbnEisyahousiki: '00',
                    mvtkNum: '',
                    mvtkKbnDenshiken: '00',
                    mvtkKbnMaeuriken: '00',
                    mvtkKbnKensyu: '00',
                    mvtkSalesPrice: 0
                }
            }
        ]
    });
    debug('seatReservationAuthorization:', seatReservationAuthorization);

    const amount = seatReservationAuthorization.result.price;
    let orderIdPrefix = util.format(
        '%s%s%s',
        moment().format('YYYYMMDD'),
        theaterCode,
        // tslint:disable-next-line:no-magic-numbers
        `00000000${seatReservationAuthorization.result.updTmpReserveSeatResult.tmpReserveNum}`.slice(-8)
    );
    debug('creating a credit card authorization...', orderIdPrefix);
    let { creditCardAuthorization, numberOfTryAuthorizeCreditCard } = await authorieCreditCardUntilSuccess(transaction.id, orderIdPrefix, amount);
    debug('creditCardAuthorization:', creditCardAuthorization, numberOfTryAuthorizeCreditCard);

    // await wait(5000);

    // debug('canceling a credit card authorization...');
    // await placeOrderTransactions.cancelCreditCardAuthorization({
    //     transactionId: transaction.id,
    //     authorizationId: creditCardAuthorization.id
    // });

    // await wait(5000);

    // debug('recreating a credit card authorization...', orderId);
    // await authorieCreditCardUntilSuccess(transaction.id, orderIdPrefix, amount).then((result) => {
    //     creditCardAuthorization = result.creditCardAuthorization;
    //     numberOfTryAuthorizeCreditCard = result.numberOfTryAuthorizeCreditCard
    // });
    // debug('creditCardAuthorization:', creditCardAuthorization, numberOfTryAuthorizeCreditCard);

    debug('registering a customer contact...');
    const contact = {
        givenName: 'John',
        familyName: 'Smith',
        telephone: '09012345678',
        email: process.env.SSKTS_DEVELOPER_EMAIL
    };
    await placeOrderTransactions.setCustomerContact({
        transactionId: transaction.id,
        contact: contact
    }).then((result) => {
        debug('customer contact registered.', result);
    });

    await wait(3000);

    debug('confirming a transaction...');
    const order = await placeOrderTransactions.confirm({
        transactionId: transaction.id
    });
    debug('confirmed. order:', order);

    // send an email
    const content = `Dear ${order.customer.name}
-------------------
Thank you for the order below.
-------------------
confirmationNumber: ${order.orderInquiryKey.confirmationNumber}
telephone: ${order.orderInquiryKey.telephone}
amount: ${order.price} yen
-------------------
`;
    debug('sending an email notification...', content);
    await placeOrderTransactions.sendEmailNotification({
        transactionId: transaction.id,
        emailMessageAttributes: {
            sender: {
                name: transaction.seller.name,
                email: 'noreply@example.com'
            },
            toRecipient: {
                name: `${contact.familyName} ${contact.givenName}`,
                email: contact.email
            },
            about: `${individualScreeningEvent.superEvent.location.name.ja} Your order created [${individualScreeningEvent.superEvent.workPerformed.name}]`,
            text: content
        }
    });
    debug('an email sent');

    return { transaction, order, numberOfTryAuthorizeCreditCard };
}

const RETRY_INTERVAL_IN_MILLISECONDS = 5000;
const MAX_NUMBER_OF_RETRY = 10;
async function authorieCreditCardUntilSuccess(transactionId, orderIdPrefix, amount) {
    let creditCardAuthorization = null;
    let numberOfTryAuthorizeCreditCard = 0;

    while (creditCardAuthorization === null) {
        numberOfTryAuthorizeCreditCard += 1;

        if (numberOfTryAuthorizeCreditCard > 1) {
            await wait(RETRY_INTERVAL_IN_MILLISECONDS);
        }

        try {
            creditCardAuthorization = await placeOrderTransactions.createCreditCardAuthorization({
                transactionId: transactionId,
                // 試行毎にオーダーIDを変更
                orderId: `${orderIdPrefix}${`00${numberOfTryAuthorizeCreditCard.toString()}`.slice(-2)}`,
                amount: amount,
                method: GMO.utils.util.Method.Lump,
                creditCard: {
                    cardNo: '4111111111111111',
                    expire: '2012',
                    securityCode: '123'
                }
            });
        } catch (error) {
            if (numberOfTryAuthorizeCreditCard >= MAX_NUMBER_OF_RETRY) {
                throw error;
            }
        }
    }

    return {
        creditCardAuthorization,
        numberOfTryAuthorizeCreditCard
    };
}

async function wait(waitInMilliseconds) {
    return new Promise((resolve) => setTimeout(resolve, waitInMilliseconds));
};

exports.main = main;
