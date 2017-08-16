/**
 * 組織サービス
 *
 * @namespace service.organization
 */
import * as sskts from '@motionpicture/sskts-domain';
import OAuth2client from '../auth/oAuth2client';
/**
 * 劇場組織検索
 */
export declare function searchMovieTheaters(args: {
    auth: OAuth2client;
    /**
     * 検索条件
     */
    searchConditions?: {};
}): Promise<sskts.service.organization.IMovieTheater[]>;
/**
 * 枝番号で劇場組織検索
 */
export declare function findMovieTheaterByBranchCode(args: {
    auth: OAuth2client;
    /**
     * 枝番号
     */
    branchCode: string;
}): Promise<sskts.service.organization.IMovieTheater | null>;
