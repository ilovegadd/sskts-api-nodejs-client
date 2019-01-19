/**
 * indexテスト
 */
import * as assert from 'assert';

import * as client from './index';

describe('import client', () => {
    it('クライアントをオブジェクトとしてインポートできるはず', () => {
        assert.equal(typeof client, 'object');
    });
});
