/**
 * 口座決済による注文プロセス
 */
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
        endpoint: process.env.API_ENDPOINT,
        auth: auth
    });
    const sellerService = new ssktsapi.service.Seller({
        endpoint: process.env.API_ENDPOINT,
        auth: auth
    });
    const placeOrderService = new ssktsapi.service.transaction.PlaceOrder({
        endpoint: process.env.API_ENDPOINT,
        auth: auth
    });
    const personService = new ssktsapi.service.Person({
        endpoint: process.env.API_ENDPOINT,
        auth: auth
    });
    const programMembershipService = new ssktsapi.service.ProgramMembership({
        endpoint: process.env.API_ENDPOINT,
        auth: auth
    });

    console.log('連絡先を検索しています...');
    const profile = await personService.getProfile({ personId: 'me' });
    console.log('連絡先が見つかりました。');

    // 取引に使用する口座を決定する
    let account;
    console.log('口座を検索しています...');
    let accounts = await personService.findAccounts({
        personId: 'me'
    });
    accounts = accounts.filter((a) => a.status === ssktsapi.factory.pecorino.accountStatusType.Opened);
    if (accounts.length === 0) {
        console.log('契約中の口座がないので開設します...');
        account = await personService.openAccount({
            personId: 'me',
            name: `${profile.familyName} ${profile.givenName}`
        });
        console.log('口座が開設されました。', account.accountNumber);
    } else {
        account = accounts[0];
    }
    console.log('口座', account.accountNumber, 'で取引を進めます。');

    console.log('クレジットカードを検索しています...');
    let creditCards = await personService.findCreditCards({
        personId: 'me'
    });
    creditCards = creditCards.filter((c) => c.deleteFlag === '0');
    if (creditCards.length === 0) {
        console.log('クレジットカードが見つからないので登録します...');
        creditCard = await personService.addCreditCard({
            personId: 'me',
            creditCard: {
                cardNo: '4111111111111111',
                expire: '2012',
                holderName: 'AA BB'
            }
        });
        console.log('クレジットカードが登録されました。', creditCard.cardSeq);
    } else {
        console.log('クレジットカード登録済です。');
    }

    // 販売者検索
    const searchSellersResult = await sellerService.search({
        location: { branchCodes: [theaterCode] }
    });
    const seller = searchSellersResult.data.shift();
    if (seller === null) {
        throw new Error('販売者が見つかりませんでした。');
    }

    /*****************************************************************
     * 会員としてポイントサービス特典を受けるためには、さらに会員プログラムへの登録処理が必要
     *****************************************************************/
    console.log('所属会員プログラムを検索します...');
    const programMembershipOwnershipInfos = await personService.searchOwnershipInfos({
        ownedBy: 'me',
        goodType: 'ProgramMembership'
    });
    console.log(programMembershipOwnershipInfos.length, '件の会員プログラムに所属しています。')
    if (programMembershipOwnershipInfos.length === 0) {
        // 会員プログラム検索
        const programMemberships = await programMembershipService.search({});
        console.log(programMemberships.length, '件の会員プログラムが見つかりました。');

        console.log('会員プログラムに登録します...');
        const registerProgramMembershipTask = await personService.registerProgramMembership({
            personId: 'me',
            programMembershipId: programMemberships[0].id,
            offerIdentifier: programMemberships[0].offers[0].identifier,
            sellerType: seller.typeOf,
            // お気に入りの劇場で登録する
            // 販売劇場と同一であることは必須ではないが、まあ結果ほとんどの場合同一だろう
            sellerId: seller.id
        });
        console.log('会員プログラム登録タスクが作成されました。', registerProgramMembershipTask.id);
    }

    // イベント検索
    const searchEventsResult = await eventService.searchScreeningEvents({
        superEvent: {
            locationBranchCodes: [seller.location.branchCode]
        },
        startFrom: moment().toDate(),
        // tslint:disable-next-line:no-magic-numbers
        startThrough: moment().add(2, 'days').toDate()
    });
    const screeningEvents = searchEventsResult.data;
    console.log(screeningEvents.length, '件のイベントが見つかりました。');

    const availableEvents = screeningEvents.filter(
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

    // 無料鑑賞券取得
    const tickets = await COA.services.master.ticket({
        theaterCode: theaterCode
    });
    const freeTickets = tickets.filter((t) => t.usePoint > 2 && t.flgMember === COA.services.master.FlgMember.Member);
    if (freeTickets.length === 0) {
        throw new Error('無料鑑賞券が見つかりませんでした。');
    }
    console.log('無料鑑賞券が見つかりました。', freeTickets);
    const selectedTicket = freeTickets[0];

    await wait(5000);
    console.log('券種を変更します...');
    // select a ticket randomly
    selectedSalesTicket = salesTicketResult[Math.floor(salesTicketResult.length * Math.random())];
    seatReservationAuthorization = await placeOrderService.changeSeatReservationOffers({
        transactionId: transaction.id,
        actionId: seatReservationAuthorization.id,
        eventIdentifier: individualScreeningEvent.identifier,
        offers: [
            {
                seatSection: sectionCode,
                seatNumber: selectedSeatCode,
                ticketInfo: {
                    ticketCode: selectedTicket.ticketCode,
                    mvtkAppPrice: 0,
                    ticketCount: 1,
                    addGlasses: 0,
                    kbnEisyahousiki: '00',
                    mvtkNum: '',
                    mvtkKbnDenshiken: '00',
                    mvtkKbnMaeuriken: '00',
                    mvtkKbnKensyu: '00',
                    mvtkSalesPrice: 0,
                    usePoint: selectedTicket.usePoint
                }
            }
        ]
    });
    console.log('券種を変更しました。', seatReservationAuthorization.id);

    // 口座承認アクション
    console.log('口座に対してオーソリを作成します...');
    let pecorinoAuthorization = await placeOrderService.createPecorinoPaymentAuthorization({
        transactionId: transaction.id,
        amount: selectedTicket.usePoint,
        fromAccountNumber: account.accountNumber
    });
    console.log('口座承認アクションが作成されました。', pecorinoAuthorization.id);

    await wait(5000);
    console.log('口座承認アクションを取り消します...');
    await placeOrderService.cancelPecorinoPaymentAuthorization({
        transactionId: transaction.id,
        actionId: pecorinoAuthorization.id
    });
    console.log('口座承認アクションを取り消しました。');

    // 口座承認アクション
    await wait(5000);
    console.log('再度口座に対してオーソリを作成します...');
    pecorinoAuthorization = await placeOrderService.createPecorinoPaymentAuthorization({
        transactionId: transaction.id,
        amount: selectedTicket.usePoint,
        fromAccountNumber: account.accountNumber
    });
    console.log('口座承認アクションが作成されました。', pecorinoAuthorization.id);

    // 差額があればクレジットカードで決済
    if (seatReservationAuthorization.result.price > 0) {
        console.log('クレジットカードに対してオーソリを作成します...');
        let creditCardAuthorization = await placeOrderService.createCreditCardAuthorization({
            transactionId: transaction.id,
            amount: seatReservationAuthorization.result.price,
            orderId: moment().unix(),
            method: '1',
            creditCard: {
                cardNo: '4111111111111111',
                // cardPass: '',
                expire: '2812',
                holderName: 'A A'
            }
        });
        console.log('クレジットカードオーソリアクションが作成されました。', creditCardAuthorization.id);
    }

    // 購入者情報入力時間
    // tslint:disable-next-line:no-magic-numbers
    await wait(5000);

    console.log('購入者連絡先を登録します...');
    await placeOrderService.setCustomerContact({
        transactionId: transaction.id,
        contact: profile
    });
    console.log('購入者連絡先を登録しました。');

    // 購入情報確認時間
    // tslint:disable-next-line:no-magic-numbers
    await wait(5000);

    console.log('ポイントインセンティブを付与します...');
    const pecorinoAwardAuthorization = await placeOrderService.createPecorinoAwardAuthorization({
        transactionId: transaction.id,
        amount: 1,
        toAccountNumber: account.accountNumber,
        notes: 'おめでとうインセンティブだよ'
    });
    console.log('ポイントインセンティブ付与が承認されました。', pecorinoAwardAuthorization.id);

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

main('118').then(() => {
    console.log('success!');
}).catch(console.error);