/**
 * a sample processing placeOrder transaction
 *
 * @ignore
 */

const COA = require('@motionpicture/coa-service');
const GMO = require('@motionpicture/gmo-service');
const debug = require('debug')('sasaki-api:samples');
const moment = require('moment');
const open = require('open');
const readline = require('readline');
const util = require('util');

const sasaki = require('../../lib/index');
const makeInquiry = require('../makeInquiryOfOrder');

async function main() {
    const scopes = [
        'phone', 'openid', 'email', 'aws.cognito.signin.user.admin', 'profile',
        'https://sskts-api-development.azurewebsites.net/transactions',
        'https://sskts-api-development.azurewebsites.net/events.read-only',
        'https://sskts-api-development.azurewebsites.net/organizations.read-only',
        'https://sskts-api-development.azurewebsites.net/people.contacts',
        'https://sskts-api-development.azurewebsites.net/people.creditCards',
        'https://sskts-api-development.azurewebsites.net/people.ownershipInfos.read-only'
    ];

    const auth = new sasaki.auth.OAuth2({
        domain: 'sskts-development.auth.ap-northeast-1.amazoncognito.com',
        clientId: process.env.TEST_CLIENT_ID_OAUTH2,
        clientSecret: process.env.TEST_CLIENT_SECRET_OAUTH2,
        redirectUri: 'https://localhost/signIn',
        logoutUri: 'https://localhost/signOut'
    });

    const state = '12345';
    const codeVerifier = '12345';

    const authUrl = auth.generateAuthUrl({
        scopes: scopes,
        state: state,
        codeVerifier: codeVerifier
    });
    console.log('authUrl:', authUrl);

    open(authUrl);

    await new Promise((resolve, reject) => {
        const rl = readline.createInterface({
            input: process.stdin,
            output: process.stdout
        });

        rl.question('enter authorization code:\n', async (code) => {
            rl.question('enter state:\n', async (givenState) => {
                if (givenState !== state) {
                    reject(new Error('state not matched'));

                    return;
                }

                let credentials = await auth.getToken(code, codeVerifier);
                console.log('credentials published', credentials);

                auth.setCredentials(credentials);

                credentials = await auth.refreshAccessToken();
                console.log('credentials refreshed', credentials);

                rl.close();
                resolve();
            });
        });
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

    const people = sasaki.service.person({
        endpoint: process.env.SSKTS_API_ENDPOINT,
        auth: auth
    });

    // retrieve user's contacts
    const contacts = await people.getContacts({
        personId: 'me'
    });
    debug('contacts:', contacts);

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

    // create a credit card
    debug('creating a credit card...');
    const creditCard = await people.addCreditCard({
        personId: 'me',
        creditCard: {
            cardNo: '4111111111111111',
            expire: '2412',
            holderName: 'JOHN SMITH'
        }
    });
    debug('a credit card created', creditCard);

    const amount = seatReservationAuthorization.price;
    const orderId = util.format(
        '%s%s%s%s',
        moment().format('YYYYMMDD'),
        theaterCode,
        // tslint:disable-next-line:no-magic-numbers
        `00000000${seatReservationAuthorization.result.tmpReserveNum}`.slice(-8),
        '01'
    );
    debug('creating a credit card authorization...');
    const creditCardAuthorization = await placeOrderTransactions.createCreditCardAuthorization({
        transactionId: transaction.id,
        orderId: orderId,
        amount: amount,
        method: GMO.utils.util.Method.Lump,
        creditCard: {
            memberId: 'me',
            cardSeq: creditCard.cardSeq
        }
    });
    debug('creditCardAuthorization:', creditCardAuthorization);

    debug('registering a customer contact...');
    await placeOrderTransactions.setCustomerContact({
        transactionId: transaction.id,
        contact: {
            givenName: contacts.givenName,
            familyName: contacts.familyName,
            telephone: contacts.telephone,
            email: process.env.SSKTS_DEVELOPER_EMAIL
        }
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
            to: process.env.SSKTS_DEVELOPER_EMAIL,
            subject: 'order created',
            content: content
        }
    });
    debug('an email sent');
}

exports.main = main;

main().then(async () => {
    await makeInquiry.main();

    debug('main processed.');
}).catch((err) => {
    console.error(err);
});
