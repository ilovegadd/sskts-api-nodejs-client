/**
 * 場所サービス
 *
 * @namespace service.place
 */

import * as factory from '@motionpicture/sskts-factory';
import { OK } from 'http-status';
import apiFetch from '../apiFetch';

import { Service } from '../service';

/**
 * place service
 *
 * @class PlaceService
 */
export class PlaceService extends Service {
    /**
     * 劇場検索
     */
    public async searchMovieTheaters(
        /**
         * 検索条件
         */
        params?: {}
    ): Promise<factory.place.movieTheater.IPlaceWithoutScreeningRoom[]> {
        return apiFetch({
            auth: this.options.auth,
            baseUrl: this.options.endpoint,
            uri: '/places/movieTheater',
            method: 'GET',
            qs: params,
            expectedStatusCodes: [OK]
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
    }): Promise<factory.place.movieTheater.IPlace> {
        return apiFetch({
            auth: this.options.auth,
            baseUrl: this.options.endpoint,
            uri: `/places/movieTheater/${params.branchCode}`,
            method: 'GET',
            qs: {},
            expectedStatusCodes: [OK]
        });
    }
}
