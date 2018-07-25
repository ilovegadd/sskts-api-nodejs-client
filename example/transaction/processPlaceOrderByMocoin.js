/**
 * Mocoin決済による注文プロセス
 * @ignore
 */
const mocoinapi = require('@mocoin/api-nodejs-client');
const moment = require('moment');
const open = require('open');
const readline = require('readline');
const ssktsapi = require('../../lib/index');
const COA = require('@motionpicture/coa-service');

async function main(theaterCode) {
    const scopes = [];

    const auth = new ssktsapi.auth.OAuth2({
        domain: process.env.TEST_AUTHORIZE_SERVER_DOMAIN,
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
                console.log('credentials published.');
                auth.setCredentials(credentials);

                rl.close();
                resolve();
            });
        });
    });

    const logoutUrl = auth.generateLogoutUrl();
    console.log('logoutUrl:', logoutUrl);

    const eventService = new ssktsapi.service.Event({
        endpoint: process.env.SSKTS_API_ENDPOINT,
        auth: auth
    });
    const organizationService = new ssktsapi.service.Organization({
        endpoint: process.env.SSKTS_API_ENDPOINT,
        auth: auth
    });
    const placeOrderService = new ssktsapi.service.transaction.PlaceOrder({
        endpoint: process.env.SSKTS_API_ENDPOINT,
        auth: auth
    });
    const personService = new ssktsapi.service.Person({
        endpoint: process.env.SSKTS_API_ENDPOINT,
        auth: auth
    });
    const programMembershipService = new ssktsapi.service.ProgramMembership({
        endpoint: process.env.SSKTS_API_ENDPOINT,
        auth: auth
    });

    console.log('連絡先を検索しています...');
    const contact = await personService.getContacts({ personId: 'me' });
    console.log('連絡先が見つかりました。');

    // 販売劇場検索
    const seller = await organizationService.findMovieTheaterByBranchCode({
        branchCode: theaterCode
    });
    if (seller === null) {
        throw new Error('販売劇場が見つかりませんでした。');
    }

    // イベント検索
    const individualScreeningEvents = await eventService.searchIndividualScreeningEvent({
        superEventLocationIdentifiers: [seller.identifier],
        startFrom: moment().toDate(),
        // tslint:disable-next-line:no-magic-numbers
        startThrough: moment().add(2, 'days').toDate()
    });
    console.log(individualScreeningEvents.length, '件のイベントが見つかりました。');

    const availableEvents = individualScreeningEvents.filter(
        (event) => (event.offer.availability !== 0)
    );
    if (availableEvents.length === 0) {
        throw new Error('予約可能なイベントがありません。');
    }
    const individualScreeningEvent = availableEvents[Math.floor(availableEvents.length * Math.random())];

    console.log('取引を開始します...');
    const transaction = await placeOrderService.start({
        expires: moment().add(30, 'minutes').toDate(),
        sellerId: seller.id
    });
    console.log('取引が開始されました。', transaction.id);

    // 販売可能券種検索
    // このサンプルは1座席購入なので、制限単位が1枚以上の券種に絞る
    const salesTicketResult = await COA.services.reserve.salesTicket({
        theaterCode: theaterCode,
        dateJouei: individualScreeningEvent.coaInfo.dateJouei,
        titleCode: individualScreeningEvent.coaInfo.titleCode,
        titleBranchNum: individualScreeningEvent.coaInfo.titleBranchNum,
        timeBegin: individualScreeningEvent.coaInfo.timeBegin,
        flgMember: COA.services.reserve.FlgMember.NonMember
    }).then((results) => results.filter((result) => result.limitUnit === '001' && result.limitCount === 1));
    console.log(salesTicketResult.length, '件の販売可能券種が見つかりました。');

    // 空席検索
    const getStateReserveSeatResult = await COA.services.reserve.stateReserveSeat({
        theaterCode: theaterCode,
        dateJouei: individualScreeningEvent.coaInfo.dateJouei,
        titleCode: individualScreeningEvent.coaInfo.titleCode,
        titleBranchNum: individualScreeningEvent.coaInfo.titleBranchNum,
        timeBegin: individualScreeningEvent.coaInfo.timeBegin,
        screenCode: individualScreeningEvent.coaInfo.screenCode
    });
    console.log(getStateReserveSeatResult.cntReserveFree, '件の空席が見つかりました。');
    const sectionCode = getStateReserveSeatResult.listSeat[0].seatSection;
    const freeSeatCodes = getStateReserveSeatResult.listSeat[0].listFreeSeat.map((freeSeat) => freeSeat.seatNum);
    if (getStateReserveSeatResult.cntReserveFree <= 0) {
        throw new Error('空席がありません。');
    }
    // 座席をランダムに選択
    const selectedSeatCode = freeSeatCodes[Math.floor(freeSeatCodes.length * Math.random())];
    // 券種をランダムに選択
    let selectedSalesTicket = salesTicketResult[Math.floor(salesTicketResult.length * Math.random())];

    await wait(5000);
    console.log('座席を仮予約します...');
    let seatReservationAuthorization = await placeOrderService.createSeatReservationAuthorization({
        transactionId: transaction.id,
        eventIdentifier: individualScreeningEvent.identifier,
        offers: [
            {
                seatSection: sectionCode,
                seatNumber: selectedSeatCode,
                ticketInfo: {
                    ticketCode: selectedSalesTicket.ticketCode,
                    mvtkAppPrice: 0,
                    ticketCount: 1,
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
    console.log('座席を仮予約しました。:', seatReservationAuthorization.id);

    // Mocoinオーソリアクション
    console.log('Mocoinログイン中...');
    const mocoinAuthClient = await loginMocoin();
    console.log('Mocoin承認中...');
    await placeOrderService.createMocoinPaymentAuthorization({
        transactionId: transaction.id,
        amount: seatReservationAuthorization.result.price,
        fromAccountNumber: '20110778400',
        notes: 'シネマサンシャイン注文取引',
        token: await mocoinAuthClient.getAccessToken()
    });
    console.log('Mocoin承認済');

    // 購入者情報入力時間
    // tslint:disable-next-line:no-magic-numbers
    await wait(5000);

    console.log('購入者連絡先を登録します...');
    await placeOrderService.setCustomerContact({
        transactionId: transaction.id,
        contact: {
            email: contact.email,
            familyName: 'せい',
            givenName: 'めい',
            telephone: '+819096793896'
        }
    });
    console.log('購入者連絡先を登録しました。');

    // 購入情報確認時間
    // tslint:disable-next-line:no-magic-numbers
    await wait(5000);

    // 取引を中止する場合はコチラ↓
    // console.log('取引を中止します...');
    // await placeOrderService.cancel({ transactionId: transaction.id });
    // console.log('取引を中止しました。');

    console.log('取引を確定します...');
    const order = await placeOrderService.confirm({
        transactionId: transaction.id,
        sendEmailMessage: false
    });
    console.log('取引確定です。', order.orderNumber);
}

async function wait(waitInMilliseconds) {
    return new Promise((resolve) => setTimeout(resolve, waitInMilliseconds));
}

async function loginMocoin() {
    const auth = new mocoinapi.auth.OAuth2({
        domain: process.env.MOCOIN_AUTHORIZE_SERVER_DOMAIN,
        clientId: process.env.MOCOIN_CLIENT_ID,
        clientSecret: process.env.MOCOIN_CLIENT_SECRET,
        redirectUri: 'https://localhost/signIn',
        logoutUri: 'https://localhost/signOut'
    });
    const state = '';
    const codeVerifier = '12345';
    const authUrl = auth.generateAuthUrl({
        scopes: [],
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
                console.log('credentials published.');
                auth.setCredentials(credentials);

                rl.close();
                resolve();
            });
        });
    });
    const logoutUrl = auth.generateLogoutUrl();
    console.log('logoutUrl:', logoutUrl);
    return auth;
}
main('118').then(() => {
    console.log('success!');
}).catch(console.error);
