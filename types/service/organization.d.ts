/**
 * 組織サービス
 *
 * @namespace service.organization
 */
import * as factory from '@motionpicture/sskts-factory';
import { Service } from '../service';
export declare class OrganizationService extends Service {
    /**
     * 劇場組織検索
     */
    searchMovieTheaters(
        /**
         * 検索条件
         */
        params?: {}): Promise<factory.organization.movieTheater.IPublicFields[]>;
    /**
     * 枝番号で劇場組織検索
     */
    findMovieTheaterByBranchCode(params: {
        /**
         * 枝番号
         */
        branchCode: string;
    }): Promise<factory.organization.movieTheater.IPublicFields | null>;
}
