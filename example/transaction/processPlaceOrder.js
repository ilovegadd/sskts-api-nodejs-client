/**
 * a sample processing placeOrder transaction
 *
 * @ignore
 */

const COA = require('@motionpicture/coa-service');
const GMO = require('@motionpicture/gmo-service');
const debug = require('debug')('sasaki-api:samples');
const moment = require('moment');
const util = require('util');

const sasaki = require('../../lib/index');
const makeInquiry = require('../makeInquiryOfOrder');

async function main() {
    const auth = new sasaki.auth.ClientCredentials({
        domain: process.env.TEST_AUTHORIZE_SERVER_DOMAIN,
        clientId: process.env.TEST_CLIENT_ID,
        clientSecret: process.env.TEST_CLIENT_SECRET,
        scopes: [
            'https://sskts-api-development.azurewebsites.net/transactions',
            'https://sskts-api-development.azurewebsites.net/events.read-only',
            'https://sskts-api-development.azurewebsites.net/organizations.read-only'
        ],
        state: 'teststate'
    });
    // const credentials = await auth.refreshAccessToken();
    // debug('credentials:', credentials);

    // auth.setCredentials({
    //     expiry_date: 1503110099,
    //     access_token: 'eyJraWQiOiJ0U3dFVmJTa0IzZzlVY01YajBpOWpISGRXRk9FamsxQUNKOHZrZ3VhV0lzPSIsImFsZyI6IlJTMjU2In0.eyJzdWIiOiJhOTZhNzZhZi04YmZhLTQwMmUtYmEzMC1kYmYxNDk0NmU0M2QiLCJ0b2tlbl91c2UiOiJhY2Nlc3MiLCJzY29wZSI6ImF3cy5jb2duaXRvLnNpZ25pbi51c2VyLmFkbWluIHBob25lIG9wZW5pZCBodHRwczpcL1wvc3NrdHMtYXBpLWRldmVsb3BtZW50LmF6dXJld2Vic2l0ZXMubmV0XC9ldmVudHMucmVhZC1vbmx5IHByb2ZpbGUgaHR0cHM6XC9cL3Nza3RzLWFwaS1kZXZlbG9wbWVudC5henVyZXdlYnNpdGVzLm5ldFwvb3JnYW5pemF0aW9ucy5yZWFkLW9ubHkgaHR0cHM6XC9cL3Nza3RzLWFwaS1kZXZlbG9wbWVudC5henVyZXdlYnNpdGVzLm5ldFwvdHJhbnNhY3Rpb25zIGVtYWlsIiwiaXNzIjoiaHR0cHM6XC9cL2NvZ25pdG8taWRwLmFwLW5vcnRoZWFzdC0xLmFtYXpvbmF3cy5jb21cL2FwLW5vcnRoZWFzdC0xX3pUaGkwajFmZSIsImV4cCI6MTUwMzEwOTk1MywiaWF0IjoxNTAzMTA2MzUzLCJ2ZXJzaW9uIjoyLCJqdGkiOiI0MWRiMGNkNi1jNDU4LTRkMDUtYTExYS1hYzM3N2IzN2NkZGQiLCJjbGllbnRfaWQiOiI2ZmlndW4xMmdjZHRsajllNTNwMnUzb3F2bCIsInVzZXJuYW1lIjoiaWxvdmVnYWRkQGdtYWlsLmNvbSJ9.TD_4abZc80dnOZoFZPea8kvIIoSMVNTRepEUdsZoGtv8889Ux445rz3XI8dp24DRfUQsY2RQWOT-t4A-Ceamh0Qj1vR-IAoQSwGFh0oU64zQeb-TRTvQ2iM4aLwuhpn1CJP9L7-fAPoc7wt97g9mNUQZkH-6-gzDkV32Cptlp5TnvZiHt6okDVjH7SqWHHSEsS3QLFilIEDamtJFdLHztdeV1Un8kt3371MCfHnbHS6-Iy6Z0D4g5un1C6Yj-ylNimfFrjRpJwylHPecoVnDK013vVY1RHwQPL0wDUJKpwt3ZuRkzQ2IQ621Jb6FwQxvhuyGFiGHEQ4_rg1KSlR7uw',
    //     token_type: 'Bearer'
    // });

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

    // search screening events
    const individualScreeningEvents = await events.searchIndividualScreeningEvent({
        theater: '118',
        day: moment().add(1, 'day').format('YYYYMMDD')
    });

    const availableEvent = individualScreeningEvents.find((event) => event.offer.availability > 0);
    if (availableEvent === undefined) {
        throw new Error('no available events');
    }

    // retrieve an event detail
    const individualScreeningEvent = await events.findIndividualScreeningEvent({
        identifier: availableEvent.identifier
    });
    if (individualScreeningEvent === null) {
        throw new Error('specified screening event not found');
    }

    // search movie theater organizations
    const movieTheaterOrganization = await organizations.findMovieTheaterByBranchCode({
        branchCode: individualScreeningEvent.coaInfo.theaterCode
    });
    if (movieTheaterOrganization === null) {
        throw new Error('movie theater shop not open');
    }

    const theaterCode = individualScreeningEvent.coaInfo.theaterCode;
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
    const salesTicketResult = await COA.services.reserve.salesTicket({
        theaterCode: theaterCode,
        dateJouei: dateJouei,
        titleCode: titleCode,
        titleBranchNum: titleBranchNum,
        timeBegin: timeBegin,
        flgMember: COA.services.reserve.FlgMember.NonMember
    });
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
    const sectionCode = getStateReserveSeatResult.listSeat[0].seatSection;
    const freeSeatCodes = getStateReserveSeatResult.listSeat[0].listFreeSeat.map((freeSeat) => {
        return freeSeat.seatNum;
    });
    if (getStateReserveSeatResult.cntReserveFree === 0) {
        throw new Error('no available seats');
    }

    debug('creating a seat reservation authorization...');
    let seatReservationAuthorization = await placeOrderTransactions.createSeatReservationAuthorization({
        transactionId: transaction.id,
        eventIdentifier: individualScreeningEvent.identifier,
        offers: [
            {
                seatSection: sectionCode,
                seatNumber: freeSeatCodes[0],
                ticketInfo: {
                    ticketCode: salesTicketResult[0].ticketCode,
                    ticketName: salesTicketResult[0].ticketName,
                    ticketNameEng: salesTicketResult[0].ticketNameEng,
                    ticketNameKana: salesTicketResult[0].ticketNameKana,
                    stdPrice: salesTicketResult[0].stdPrice,
                    addPrice: salesTicketResult[0].addPrice,
                    disPrice: 0,
                    salePrice: salesTicketResult[0].salePrice,
                    mvtkAppPrice: 0,
                    ticketCount: 1,
                    seatNum: freeSeatCodes[0],
                    addGlasses: 0,
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
        authorizationId: seatReservationAuthorization.id
    });

    debug('recreating a seat reservation authorization...');
    seatReservationAuthorization = await placeOrderTransactions.createSeatReservationAuthorization({
        transactionId: transaction.id,
        eventIdentifier: individualScreeningEvent.identifier,
        offers: [
            {
                seatSection: sectionCode,
                seatNumber: freeSeatCodes[0],
                ticketInfo: {
                    ticketCode: salesTicketResult[1].ticketCode,
                    ticketName: salesTicketResult[1].ticketName,
                    ticketNameEng: salesTicketResult[1].ticketNameEng,
                    ticketNameKana: salesTicketResult[1].ticketNameKana,
                    stdPrice: salesTicketResult[1].stdPrice,
                    addPrice: salesTicketResult[1].addPrice,
                    disPrice: 0,
                    salePrice: salesTicketResult[1].salePrice,
                    mvtkAppPrice: 0,
                    ticketCount: 1,
                    seatNum: freeSeatCodes[0],
                    addGlasses: 0,
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
    let orderId = util.format(
        '%s%s%s%s',
        moment().format('YYYYMMDD'),
        theaterCode,
        // tslint:disable-next-line:no-magic-numbers
        `00000000${seatReservationAuthorization.result.updTmpReserveSeatResult.tmpReserveNum}`.slice(-8),
        '01'
    );
    debug('creating a credit card authorization...', orderId);
    let creditCardAuthorization = await placeOrderTransactions.createCreditCardAuthorization({
        transactionId: transaction.id,
        orderId: orderId,
        amount: amount,
        method: GMO.utils.util.Method.Lump,
        creditCard: {
            cardNo: '4111111111111111',
            expire: '2012',
            securityCode: '123'
        }
    });
    debug('creditCardAuthorization:', creditCardAuthorization);

    debug('canceling a credit card authorization...');
    await placeOrderTransactions.cancelCreditCardAuthorization({
        transactionId: transaction.id,
        authorizationId: creditCardAuthorization.id
    });

    orderId = util.format(
        '%s%s%s%s',
        moment().format('YYYYMMDD'),
        theaterCode,
        // tslint:disable-next-line:no-magic-numbers
        `00000000${seatReservationAuthorization.result.updTmpReserveSeatResult.tmpReserveNum}`.slice(-8),
        '02'
    );
    debug('recreating a credit card authorization...', orderId);
    creditCardAuthorization = await placeOrderTransactions.createCreditCardAuthorization({
        transactionId: transaction.id,
        orderId: orderId,
        amount: amount,
        method: GMO.utils.util.Method.Lump,
        creditCard: {
            cardNo: '4111111111111111',
            expire: '2012',
            securityCode: '123'
        }
    });
    debug('creditCardAuthorization:', creditCardAuthorization);

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
    });
    debug('customer contact registered');

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
        emailNotification: {
            from: 'noreply@example.com',
            to: contact.email,
            subject: 'order created',
            content: content
        }
    });
    debug('an email sent');

    return order;
}

exports.main = main;

main().then(async () => {
    await makeInquiry.main();

    debug('main processed.');
}).catch((err) => {
    console.error(err);
});
