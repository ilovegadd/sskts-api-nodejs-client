/**
 * 組織サービス
 *
 * @namespace service.organization
 */
import * as sskts from '@motionpicture/sskts-domain';
import { Service } from '../service';
export declare class OrganizationService extends Service {
    /**
     * 劇場組織検索
     */
    searchMovieTheaters(
        /**
         * 検索条件
         */
        searchConditions?: {}): Promise<sskts.service.organization.IMovieTheater[]>;
    /**
     * 枝番号で劇場組織検索
     */
    findMovieTheaterByBranchCode(args: {
        /**
         * 枝番号
         */
        branchCode: string;
    }): Promise<sskts.service.organization.IMovieTheater | null>;
}
