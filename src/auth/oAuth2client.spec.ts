
/**
 * OAuth2 client test
 * @ignore
 */

// import { OK } from 'http-status';
import * as nock from 'nock';
import * as assert from 'power-assert';
import OAuth2client from './oAuth2client';

// function testNoTokens(urlshortener, oauth2client, cb) {
//     urlshortener.url.get({
//         shortUrl: '123',
//         auth: oauth2client
//     }, (err, result) => {
//         assert.equal(err.message, 'No access or refresh token is set.');
//         assert.equal(result, null);
//         cb();
//     });
// }

describe('OAuth2 client', () => {
    // let remoteDrive;

    before(() => {
        nock.cleanAll();
    });

    beforeEach(() => {
        nock.cleanAll();
        nock.disableNetConnect();
    });

    const DOMAIN = 'DOMAIN';
    const CLIENT_ID = 'CLIENT_ID';
    const CLIENT_SECRET = 'CLIENT_SECRET';
    const REDIRECT_URI = 'REDIRECT_URI';

    it('should return err if no access or refresh token is set', async () => {
        const auth = new OAuth2client({
            domain: DOMAIN,
            clientId: CLIENT_ID,
            clientSecret: CLIENT_SECRET,
            redirectUri: REDIRECT_URI
        });

        const transferError = await auth.getAccessToken()
            .catch((error) => {
                return error;
            });
        assert(transferError instanceof Error);
    });

    // it('should not error if only refresh token is set', () => {
    //     const auth = new sasaki.auth.OAuth2({
    //         domain: DOMAIN,
    //         clientId: CLIENT_ID,
    //         clientSecret: CLIENT_SECRET,
    //         redirectUri: REDIRECT_URI
    //     });

    //     auth.credentials = { refresh_token: 'refresh_token' };
    //     assert.doesNotThrow(async () => {
    //         await auth.getAccessToken();
    //         // const options = { auth: oauth2client, shortUrl: '...' };
    //         // localUrlshortener.url.get(options, utils.noop);
    //     });
    // });

    // it('should set access token type to Bearer if none is set', (done) => {
    //     const oauth2client = new sasaki.auth.OAuth2(
    //         CLIENT_ID,
    //         CLIENT_SECRET,
    //         REDIRECT_URI
    //     );
    //     oauth2client.credentials = { access_token: 'foo', refresh_token: '' };
    //     const scope = nock('https://www.sasaki.com')
    //         .get('/urlshortener/v1/url/history')
    //         .times(2)
    //         .reply(200);

    //     testNoBearer(localUrlshortener, oauth2client, (err) => {
    //         if (err) {
    //             return done(err);
    //         }
    //     });
    // });

    // it('should refresh if access token is expired', (done) => {
    //     const scope = nock('https://accounts.google.com')
    //         .post('/o/oauth2/token')
    //         .times(2)
    //         .reply(200, { access_token: 'abc123', expires_in: 1 });
    //     let oauth2client = new sasaki.auth.OAuth2(
    //         CLIENT_ID,
    //         CLIENT_SECRET,
    //         REDIRECT_URI
    //     );
    //     let now = new Date().getTime();
    //     let twoSecondsAgo = now - 2000;
    //     oauth2client.credentials = { refresh_token: 'abc', expiry_date: twoSecondsAgo };
    //     testExpired(localDrive, oauth2client, now, () => {
    //         oauth2client = new sasaki.auth.OAuth2(
    //             CLIENT_ID,
    //             CLIENT_SECRET,
    //             REDIRECT_URI
    //         );
    //         now = new Date().getTime();
    //         twoSecondsAgo = now - 2000;
    //         oauth2client.credentials = {
    //             refresh_token: 'abc',
    //             expiry_date: twoSecondsAgo
    //         };
    //     });
    // });

    // it('should make request if access token not expired', (done) => {
    //     const scope = nock('https://accounts.google.com')
    //         .post('/o/oauth2/token')
    //         .times(2)
    //         .reply(200, { access_token: 'abc123', expires_in: 10000 });
    //     let oauth2client = new sasaki.auth.OAuth2(
    //         CLIENT_ID,
    //         CLIENT_SECRET,
    //         REDIRECT_URI
    //     );
    //     let now = (new Date()).getTime();
    //     let tenSecondsFromNow = now + 10000;
    //     oauth2client.credentials = {
    //         access_token: 'abc123',
    //         refresh_token: 'abc',
    //         expiry_date: tenSecondsFromNow
    //     };
    //     localDrive.files.get({ fileId: 'wat', auth: oauth2client }, () => {
    //         assert.equal(JSON.stringify(oauth2client.credentials), JSON.stringify({
    //             access_token: 'abc123',
    //             refresh_token: 'abc',
    //             expiry_date: tenSecondsFromNow,
    //             token_type: 'Bearer'
    //         }));

    //         assert.throws(() => {
    //             scope.done();
    //         }, 'AssertionError');
    //         oauth2client = new sasaki.auth.OAuth2(
    //             CLIENT_ID,
    //             CLIENT_SECRET,
    //             REDIRECT_URI
    //         );
    //         now = (new Date()).getTime();
    //         tenSecondsFromNow = now + 10000;
    //         oauth2client.credentials = {
    //             access_token: 'abc123',
    //             refresh_token: 'abc',
    //             expiry_date: tenSecondsFromNow
    //         };
    //     });
    // });

    // it('should refresh if have refresh token but no access token', (done) => {
    //     const scope = nock('https://accounts.google.com')
    //         .post('/o/oauth2/token')
    //         .times(2)
    //         .reply(200, { access_token: 'abc123', expires_in: 1 });
    //     let oauth2client = new sasaki.auth.OAuth2(
    //         CLIENT_ID,
    //         CLIENT_SECRET,
    //         REDIRECT_URI
    //     );
    //     let now = (new Date()).getTime();
    //     oauth2client.credentials = { refresh_token: 'abc' };
    //     testNoAccessToken(localDrive, oauth2client, now, () => {
    //         now = (new Date()).getTime();
    //         oauth2client.credentials = { refresh_token: 'abc' };
    //     });
    // });

    // describe('revokeCredentials()', () => {
    //     it('should revoke credentials if access token present', (done) => {
    //         const scope = nock('https://accounts.google.com')
    //             .get('/o/oauth2/revoke?token=abc')
    //             .reply(200, { success: true });
    //         const oauth2client = new sasaki.auth.OAuth2(CLIENT_ID, CLIENT_SECRET, REDIRECT_URI);
    //         oauth2client.credentials = { access_token: 'abc', refresh_token: 'abc' };
    //         oauth2client.revokeCredentials((err, result) => {
    //             assert.equal(err, null);
    //             assert.equal(result.success, true);
    //             assert.equal(JSON.stringify(oauth2client.credentials), '{}');
    //             scope.done();
    //             done();
    //         });
    //     });

    //     it('should clear credentials and return error if no access token to revoke', (done) => {
    //         const oauth2client = new sasaki.auth.OAuth2(CLIENT_ID, CLIENT_SECRET, REDIRECT_URI);
    //         oauth2client.credentials = { refresh_token: 'abc' };
    //         oauth2client.revokeCredentials((err, result) => {
    //             assert.equal(err.message, 'No access token to revoke.');
    //             assert.equal(result, null);
    //             assert.equal(JSON.stringify(oauth2client.credentials), '{}');
    //             done();
    //         });
    //     });
    // });

    // describe('getToken()', () => {
    //     it('should return expiry_date', (done) => {
    //         const now = (new Date()).getTime();
    //         const scope = nock('https://accounts.google.com')
    //             .post('/o/oauth2/token')
    //             .reply(200, { access_token: 'abc', refresh_token: '123', expires_in: 10 });
    //         const oauth2client = new sasaki.auth.OAuth2(CLIENT_ID, CLIENT_SECRET, REDIRECT_URI);
    //         oauth2client.getToken('code here', (err, tokens) => {
    //             if (err) {
    //                 return done(err);
    //             }
    //             assert(tokens.expiry_date >= now + (10 * 1000));
    //             assert(tokens.expiry_date <= now + (15 * 1000));
    //             scope.done();
    //             done();
    //         });
    //     });
    // });

    after(() => {
        nock.cleanAll();
        nock.enableNetConnect();
    });
});
