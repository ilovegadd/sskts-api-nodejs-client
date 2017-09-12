/**
 * a sample processing placeOrder transaction By mvtk
 *
 * @ignore
 */

const COA = require('@motionpicture/coa-service');
const GMO = require('@motionpicture/gmo-service');
const debug = require('debug')('sasaki-api:samples');
const moment = require('moment');
const sasaki = require('../../lib/index');

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

    const availableEvents = individualScreeningEvents.filter((event) => event.offer.availability > 0);
    if (availableEvents.length === 0) {
        throw new Error('no available events');
    }

    const availableEvent = availableEvents[Math.floor(availableEvents.length * Math.random())];

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

    // 販売可能チケット検索
    const salesTicketResult = await COA.services.reserve.salesTicket({
        theaterCode: theaterCode,
        dateJouei: dateJouei,
        titleCode: titleCode,
        titleBranchNum: titleBranchNum,
        timeBegin: timeBegin,
        flgMember: COA.services.reserve.FlgMember.NonMember
    });
    debug('salesTicketResult:', salesTicketResult);

    // COA空席確認
    const getStateReserveSeatResult = await COA.services.reserve.stateReserveSeat({
        theaterCode: theaterCode,
        dateJouei: dateJouei,
        titleCode: titleCode,
        titleBranchNum: titleBranchNum,
        timeBegin: timeBegin,
        screenCode: screenCode
    });
    debug('getStateReserveSeatResult is', getStateReserveSeatResult);
    const sectionCode = getStateReserveSeatResult.listSeat[0].seatSection;
    const freeSeatCodes = getStateReserveSeatResult.listSeat[0].listFreeSeat.map((freeSeat) => {
        return freeSeat.seatNum;
    });
    debug('freeSeatCodes count', freeSeatCodes.length);
    if (getStateReserveSeatResult.cntReserveFree === 0) {
        throw new Error('no available seats.');
    }

    // COAオーソリ追加
    debug('authorizing seat reservation...');
    const totalPrice = salesTicketResult[0].salePrice;

    const seatReservationAuthorization = await placeOrderTransactions.createSeatReservationAuthorization({
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
                    stdPrice: 0,
                    addPrice: 0,
                    disPrice: 0,
                    salePrice: 0,
                    mvtkAppPrice: 1200,
                    ticketCount: 1,
                    seatNum: freeSeatCodes[0],
                    addGlasses: 0,
                    kbnEisyahousiki: '00',
                    mvtkNum: '4450899842',
                    mvtkKbnDenshiken: '00',
                    mvtkKbnMaeuriken: '00',
                    mvtkKbnKensyu: '00',
                    mvtkSalesPrice: 1400
                }
            }
        ]
    });
    debug('seatReservationAuthorization is', seatReservationAuthorization);

    // 本当はここでムビチケ着券処理
    const mvtkResult = {
        price: 1400,
        seatSyncInfoIn: {
            kgygishCd: 'SSK000',
            yykDvcTyp: '00',
            trkshFlg: '0',
            kgygishSstmZskyykNo: '118124',
            kgygishUsrZskyykNo: '124',
            jeiDt: '2017/03/02 10:00:00',
            kijYmd: '2017/03/02',
            stCd: theaterCode.slice(-2),
            screnCd: screenCode,
            knyknrNoInfo: [
                {
                    knyknrNo: '4450899842',
                    pinCd: '7648',
                    knshInfo: [
                        { knshTyp: '01', miNum: 1 }
                    ]
                }
            ],
            zskInfo: seatReservationAuthorization.result.updTmpReserveSeatResult.listTmpReserve.map((tmpReserve) => {
                return { zskCd: tmpReserve.seatNum };
            }),
            skhnCd: `${titleCode}${titleBranchNum}`
        }
    };

    // ムビチケオーソリ追加(着券した体で) 値はほぼ適当です
    debug('adding authorizations mvtk...');
    let mvtkAuthorization = await placeOrderTransactions.createMvtkAuthorization({
        transactionId: transaction.id,
        mvtk: mvtkResult
    });
    debug('addMvtkAuthorization is', mvtkAuthorization);

    // ムビチケ取消
    await placeOrderTransactions.cancelMvtkAuthorization({
        transactionId: transaction.id,
        authorizationId: mvtkAuthorization.id
    });

    // 再度ムビチケ追加
    debug('adding authorizations mvtk...', theaterCode.slice(-2));
    mvtkAuthorization = await placeOrderTransactions.createMvtkAuthorization({
        transactionId: transaction.id,
        mvtk: mvtkResult
    });
    debug('addMvtkAuthorization is', mvtkAuthorization);
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

    // 取引成立
    debug('confirming transaction...');
    const order = await placeOrderTransactions.confirm({
        transactionId: transaction.id
    });
    debug('your order is', order);
}

main().then(() => {
    debug('main processed.');
}).catch((err) => {
    console.error(err.message);
});
