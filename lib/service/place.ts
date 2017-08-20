/**
 * 場所サービス
 *
 * @namespace service.place
 */

import * as sskts from '@motionpicture/sskts-domain';
import { NOT_FOUND, OK } from 'http-status';
import apiRequest from '../apiRequest';

import { Service } from '../service';

export class PlaceService extends Service {
    /**
     * 劇場検索
     */
    public async searchMovieTheaters(
        /**
         * 検索条件
         */
        params?: sskts.service.place.ISearchMovieTheatersConditions
    ): Promise<sskts.service.place.ISearchMovieTheaterResult[]> {
        return await apiRequest({
            auth: this.options.auth,
            baseUrl: this.options.endpoint,
            uri: '/places/movieTheater',
            method: 'GET',
            expectedStatusCodes: [OK],
            qs: params
        });
    }

    /**
     * 劇場情報取得
     */
    public async findMovieTheater(params: {
        /**
         * 枝番号
         */
        branchCode: string;
    }): Promise<sskts.factory.place.movieTheater.IPlace | null> {
        return await apiRequest({
            auth: this.options.auth,
            baseUrl: this.options.endpoint,
            uri: `/places/movieTheater/${params.branchCode}`,
            method: 'GET',
            expectedStatusCodes: [NOT_FOUND, OK]
        });
    }
}
