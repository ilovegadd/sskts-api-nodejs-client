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
        params?: {}
    ): Promise<sskts.service.organization.IMovieTheater[]> {
        return await apiRequest({
            auth: this.options.auth,
            baseUrl: this.options.endpoint,
            uri: '/organizations/movieTheater',
            method: 'GET',
            expectedStatusCodes: [OK],
            qs: params
        });
    }

    /**
     * 枝番号で劇場組織検索
     */
    public async findMovieTheaterByBranchCode(params: {
        /**
         * 枝番号
         */
        branchCode: string;
    }): Promise<sskts.service.organization.IMovieTheater | null> {
        return await apiRequest({
            auth: this.options.auth,
            baseUrl: this.options.endpoint,
            uri: `/organizations/movieTheater/${params.branchCode}`,
            method: 'GET',
            expectedStatusCodes: [NOT_FOUND, OK]
        });
    }
}
