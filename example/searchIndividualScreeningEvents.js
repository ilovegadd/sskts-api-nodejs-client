/**
 * 上映イベント検索サンプル
 * @ignore
 */

const moment = require('moment');
const momentTimezone = require('moment-timezone');
const sasaki = require('../lib/index');
const COA = require('@motionpicture/coa-service');
const difference = require('lodash.difference');
const fs = require('fs');

async function main(theaterCode) {
    const auth = new sasaki.auth.ClientCredentials({
        domain: process.env.TEST_AUTHORIZE_SERVER_DOMAIN,
        clientId: process.env.TEST_CLIENT_ID,
        clientSecret: process.env.TEST_CLIENT_SECRET,
        scopes: [
            process.env.TEST_RESOURCE_IDENTIFIER + '/events.read-only'
        ],
        state: 'teststate'
    });

    const event = sasaki.service.event({
        endpoint: process.env.SSKTS_API_ENDPOINT,
        auth: auth
    });

    const startFrom = moment(`${moment().format('YYYY-MM-DD')}T00:00:00+09:00`);
    const startThrough = moment(startFrom).add(5, 'weeks');
    const individualScreeningEvents = await event.searchIndividualScreeningEvent({
        theater: theaterCode,
        startFrom: startFrom.toDate(),
        startThrough: startThrough.toDate()
    });
    console.log('individualScreeningEvents are', individualScreeningEvents[individualScreeningEvents.length - 1]);
    console.log('number of individualScreeningEvents is', individualScreeningEvents.length);

    // COAから上映イベント取得
    console.log('searching from COA...', startFrom.tz('Asia/Tokyo').format('YYYYMMDD'), startThrough.tz('Asia/Tokyo').format('YYYYMMDD'));
    const schedulesFromCOA = await COA.services.master.schedule({
        theaterCode: theaterCode,
        begin: startFrom.tz('Asia/Tokyo').format('YYYYMMDD'), // COAは日本時間で判断
        end: startThrough.tz('Asia/Tokyo').format('YYYYMMDD') // COAは日本時間で判断
    });
    const eventIdsFromCOA = schedulesFromCOA.map((schedule) => {
        return [
            theaterCode,
            schedule.titleCode,
            schedule.titleBranchNum,
            schedule.dateJouei,
            schedule.screenCode,
            schedule.timeBegin
        ].join('');
    });
    console.log('number of eventIdsFromCOA is', eventIdsFromCOA.length);

    let eventIdentifiers = individualScreeningEvents.map((e) => e.identifier);
    // eventIdentifiers = eventIdentifiers.filter((i) => eventIdsFromCOA.indexOf(i) >= 0);
    console.log('number of eventIdentifiers is', eventIdentifiers.length);
    const diff = difference(eventIdentifiers, eventIdsFromCOA);
    console.log('diff length:', diff.length);
    fs.writeFileSync(`${__dirname}/diff-${theaterCode}.json`, JSON.stringify(diff, null, '    '));
}

Promise.all(['001', '012', '018'].map(async (theaterCode) => {
    try {
        await main(theaterCode);
    } catch (error) {
        // no op
    }
})).then(() => {
    console.log('main processed.');
}).catch((err) => {
    console.error(err);
});
