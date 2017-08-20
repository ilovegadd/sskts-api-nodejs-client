/**
 * 場所サービス
 *
 * @namespace service.place
 */
import * as sskts from '@motionpicture/sskts-domain';
import { Service } from '../service';
export declare class PlaceService extends Service {
    /**
     * 劇場検索
     */
    searchMovieTheaters(
        /**
         * 検索条件
         */
        params?: sskts.service.place.ISearchMovieTheatersConditions): Promise<sskts.service.place.ISearchMovieTheaterResult[]>;
    /**
     * 劇場情報取得
     */
    findMovieTheater(params: {
        /**
         * 枝番号
         */
        branchCode: string;
    }): Promise<sskts.factory.place.movieTheater.IPlace | null>;
}
