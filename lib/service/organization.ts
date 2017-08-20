/**
 * 組織サービス
 *
 * @namespace service.organization
 */

import * as sskts from '@motionpicture/sskts-domain';
import { NOT_FOUND, OK } from 'http-status';
import apiRequest from '../apiRequest';

import { Service } from '../service';

export class OrganizationService extends Service {
    /**
     * 劇場組織検索
     */
    public async searchMovieTheaters(
        /**
         * 検索条件
         */
        searchConditions?: {}
    ): Promise<sskts.service.organization.IMovieTheater[]> {
        return await apiRequest({
            baseUrl: this.options.endpoint,
            uri: '/organizations/movieTheater',
            method: 'GET',
            expectedStatusCodes: [OK],
            auth: { bearer: await this.options.auth.getAccessToken() },
            qs: searchConditions
        });
    }

    /**
     * 枝番号で劇場組織検索
     */
    public async findMovieTheaterByBranchCode(args: {
        /**
         * 枝番号
         */
        branchCode: string;
    }): Promise<sskts.service.organization.IMovieTheater | null> {
        return await apiRequest({
            baseUrl: this.options.endpoint,
            uri: `/organizations/movieTheater/${args.branchCode}`,
            method: 'GET',
            expectedStatusCodes: [NOT_FOUND, OK],
            auth: { bearer: await this.options.auth.getAccessToken() }
        });
    }
}
