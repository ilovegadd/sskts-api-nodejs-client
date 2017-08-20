/**
 * 注文取引プロセスサンプル
 *
 * @ignore
 */

const ssktsDomain = require('@motionpicture/sskts-domain');
const COA = ssktsDomain.COA;
const GMO = ssktsDomain.GMO;
const debug = require('debug')('sskts-api:samples');
const moment = require('moment');
const util = require('util');
const sskts = require('../../lib/index');

// tslint:disable-next-line:max-func-body-length
async function main() {
    const auth = new sskts.auth.ClientCredentials(
        process.env.TEST_CLIENT_ID,
        process.env.TEST_CLIENT_SECRET,
        'teststate',
        [
            'https://sskts-api-development.azurewebsites.net/transactions',
            'https://sskts-api-development.azurewebsites.net/events.read-only',
            'https://sskts-api-development.azurewebsites.net/organizations.read-only'
        ]
    );
    const credentials = await auth.refreshAccessToken();
    debug('credentials:', credentials);

    // auth.setCredentials({
    //     expiry_date: 1503110099,
    //     access_token: 'eyJraWQiOiJ0U3dFVmJTa0IzZzlVY01YajBpOWpISGRXRk9FamsxQUNKOHZrZ3VhV0lzPSIsImFsZyI6IlJTMjU2In0.eyJzdWIiOiJhOTZhNzZhZi04YmZhLTQwMmUtYmEzMC1kYmYxNDk0NmU0M2QiLCJ0b2tlbl91c2UiOiJhY2Nlc3MiLCJzY29wZSI6ImF3cy5jb2duaXRvLnNpZ25pbi51c2VyLmFkbWluIHBob25lIG9wZW5pZCBodHRwczpcL1wvc3NrdHMtYXBpLWRldmVsb3BtZW50LmF6dXJld2Vic2l0ZXMubmV0XC9ldmVudHMucmVhZC1vbmx5IHByb2ZpbGUgaHR0cHM6XC9cL3Nza3RzLWFwaS1kZXZlbG9wbWVudC5henVyZXdlYnNpdGVzLm5ldFwvb3JnYW5pemF0aW9ucy5yZWFkLW9ubHkgaHR0cHM6XC9cL3Nza3RzLWFwaS1kZXZlbG9wbWVudC5henVyZXdlYnNpdGVzLm5ldFwvdHJhbnNhY3Rpb25zIGVtYWlsIiwiaXNzIjoiaHR0cHM6XC9cL2NvZ25pdG8taWRwLmFwLW5vcnRoZWFzdC0xLmFtYXpvbmF3cy5jb21cL2FwLW5vcnRoZWFzdC0xX3pUaGkwajFmZSIsImV4cCI6MTUwMzEwOTk1MywiaWF0IjoxNTAzMTA2MzUzLCJ2ZXJzaW9uIjoyLCJqdGkiOiI0MWRiMGNkNi1jNDU4LTRkMDUtYTExYS1hYzM3N2IzN2NkZGQiLCJjbGllbnRfaWQiOiI2ZmlndW4xMmdjZHRsajllNTNwMnUzb3F2bCIsInVzZXJuYW1lIjoiaWxvdmVnYWRkQGdtYWlsLmNvbSJ9.TD_4abZc80dnOZoFZPea8kvIIoSMVNTRepEUdsZoGtv8889Ux445rz3XI8dp24DRfUQsY2RQWOT-t4A-Ceamh0Qj1vR-IAoQSwGFh0oU64zQeb-TRTvQ2iM4aLwuhpn1CJP9L7-fAPoc7wt97g9mNUQZkH-6-gzDkV32Cptlp5TnvZiHt6okDVjH7SqWHHSEsS3QLFilIEDamtJFdLHztdeV1Un8kt3371MCfHnbHS6-Iy6Z0D4g5un1C6Yj-ylNimfFrjRpJwylHPecoVnDK013vVY1RHwQPL0wDUJKpwt3ZuRkzQ2IQ621Jb6FwQxvhuyGFiGHEQ4_rg1KSlR7uw',
    //     token_type: 'Bearer'
    // });

    const events = sskts.service.event({
        endpoint: process.env.SSKTS_API_ENDPOINT,
        auth: auth
    });

    const organizations = sskts.service.organization({
        endpoint: process.env.SSKTS_API_ENDPOINT,
        auth: auth
    });

    const placeOrderTransactions = sskts.service.transaction.placeOrder({
        endpoint: process.env.SSKTS_API_ENDPOINT,
        auth: auth
    });

    // 上映イベント検索
    const individualScreeningEvents = await events.searchIndividualScreeningEvent({
        theater: '118',
        day: moment().add(1, 'day').format('YYYYMMDD')
    });

    // イベント情報取得
    const individualScreeningEvent = await events.findIndividualScreeningEvent({
        identifier: individualScreeningEvents[0].identifier
    });
    if (individualScreeningEvent === null) {
        throw new Error('指定された上映イベントが見つかりません');
    }

    // 劇場ショップ検索
    const movieTheaterOrganization = await organizations.findMovieTheaterByBranchCode({
        branchCode: individualScreeningEvent.coaInfo.theaterCode
    });
    if (movieTheaterOrganization === null) {
        throw new Error('劇場ショップがオープンしていません');
    }

    const theaterCode = individualScreeningEvent.coaInfo.theaterCode;
    const dateJouei = individualScreeningEvent.coaInfo.dateJouei;
    const titleCode = individualScreeningEvent.coaInfo.titleCode;
    const titleBranchNum = individualScreeningEvent.coaInfo.titleBranchNum;
    const timeBegin = individualScreeningEvent.coaInfo.timeBegin;
    const screenCode = individualScreeningEvent.coaInfo.screenCode;

    // 取引開始
    // 1分後のunix timestampを送信する場合
    // https://ja.wikipedia.org/wiki/UNIX%E6%99%82%E9%96%93
    debug('注文取引を開始します...');
    const transaction = await placeOrderTransactions.start({
        expires: moment().add(1, 'minutes').toDate(),
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
    debug('販売可能チケットは', salesTicketResult);

    // COA空席確認
    const getStateReserveSeatResult = await COA.services.reserve.stateReserveSeat({
        theaterCode: theaterCode,
        dateJouei: dateJouei,
        titleCode: titleCode,
        titleBranchNum: titleBranchNum,
        timeBegin: timeBegin,
        screenCode: screenCode
    });
    debug('空席情報は', getStateReserveSeatResult);
    const sectionCode = getStateReserveSeatResult.listSeat[0].seatSection;
    const freeSeatCodes = getStateReserveSeatResult.listSeat[0].listFreeSeat.map((freeSeat) => {
        return freeSeat.seatNum;
    });
    if (getStateReserveSeatResult.cntReserveFree === 0) {
        throw new Error('空席がありません');
    }

    // 座席仮予約
    debug('座席を仮予約します...');
    let seatReservationAuthorization = await placeOrderTransactions.createSeatReservationAuthorization({
        transactionId: transaction.id,
        eventIdentifier: individualScreeningEvent.identifier,
        offers: [
            {
                seatSection: sectionCode,
                seatNumber: freeSeatCodes[0],
                ticket: {
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
    debug('座席を仮予約しました', seatReservationAuthorization);

    // 座席仮予約取消
    debug('座席仮予約を取り消します...');
    await placeOrderTransactions.cancelSeatReservationAuthorization({
        transactionId: transaction.id,
        authorizationId: seatReservationAuthorization.id
    });

    // 再度座席仮予約
    debug('座席を仮予約します...');
    seatReservationAuthorization = await placeOrderTransactions.createSeatReservationAuthorization({
        transactionId: transaction.id,
        eventIdentifier: individualScreeningEvent.identifier,
        offers: [
            {
                seatSection: sectionCode,
                seatNumber: freeSeatCodes[0],
                ticket: {
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
    debug('座席を仮予約しました', seatReservationAuthorization);

    const amount = seatReservationAuthorization.price;

    // クレジットカードオーソリ取得
    let orderId = util.format(
        '%s%s%s%s',
        moment().format('YYYYMMDD'),
        theaterCode,
        // tslint:disable-next-line:no-magic-numbers
        `00000000${seatReservationAuthorization.result.tmpReserveNum}`.slice(-8),
        '01'
    );
    debug('クレジットカードのオーソリをとります...');
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
    debug('クレジットカードのオーソリがとれました', creditCardAuthorization);

    // クレジットカードオーソリ取消
    debug('クレジットカードのオーソリを取り消します...');
    await placeOrderTransactions.cancelCreditCardAuthorization({
        transactionId: transaction.id,
        authorizationId: creditCardAuthorization.id
    });

    // 再度クレジットカードオーソリ
    orderId = util.format(
        '%s%s%s%s',
        moment().format('YYYYMMDD'),
        theaterCode,
        // tslint:disable-next-line:no-magic-numbers
        `00000000${seatReservationAuthorization.result.tmpReserveNum}`.slice(-8),
        '02'
    );
    debug('クレジットカードのオーソリをとります...');
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
    debug('クレジットカードのオーソリがとれました', creditCardAuthorization);

    // 購入者情報登録
    debug('購入者情報を登録します...');
    const profile = {
        givenName: 'てつ',
        familyName: 'やまざき',
        telephone: '09012345678',
        email: process.env.SSKTS_DEVELOPER_EMAIL
    };
    await placeOrderTransactions.setAgentProfile({
        transactionId: transaction.id,
        profile: profile
    });
    debug('購入者情報を登録しました');

    // 取引確定
    debug('注文取引を確定します...');
    const order = await placeOrderTransactions.confirm({
        transactionId: transaction.id
    });
    debug('注文が作成されました', order);

    // メール追加
    const content = `
${order.customer.name} 様
-------------------------------------------------------------------
この度はご購入いただき誠にありがとうございます。
-------------------------------------------------------------------
◆購入番号 ：${order.orderInquiryKey.orderNumber}
                    ◆電話番号 ${order.orderInquiryKey.telephone}
                    ◆合計金額 ：${order.price}円
-------------------------------------------------------------------
`;
    debug('メール通知を実行します...', content);
    await placeOrderTransactions.sendEmailNotification({
        transactionId: transaction.id,
        emailNotification: {
            from: 'noreply@example.com',
            to: profile.email,
            subject: '購入完了',
            content: content
        }
    });
    debug('メール通知が実行されました');
}

main().then(() => {
    debug('main processed.');
}).catch((err) => {
    console.error(err);
});
