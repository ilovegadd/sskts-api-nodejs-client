/**
 * 場所サービス
 *
 * @namespace service.place
 */
import * as factory from '@motionpicture/sskts-factory';
import { Service } from '../service';
/**
 * place service
 *
 * @class PlaceService
 */
export declare class PlaceService extends Service {
    /**
     * 劇場検索
     */
    searchMovieTheaters(
        /**
         * 検索条件
         */
        params?: {}): Promise<factory.place.movieTheater.IPlaceWithoutScreeningRoom[]>;
    /**
     * 劇場情報取得
     */
    findMovieTheater(params: {
        /**
         * 枝番号
         */
        branchCode: string;
    }): Promise<factory.place.movieTheater.IPlace | null>;
}
