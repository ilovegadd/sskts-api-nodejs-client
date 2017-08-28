import * as factory from '@motionpicture/sskts-factory';
import { Service } from '../service';
/**
 * event service
 * @class EventService
 */
export declare class EventService extends Service {
    /**
     * 上映イベント検索
     */
    searchIndividualScreeningEvent(
        /**
         * 検索条件
         */
        params: factory.event.individualScreeningEvent.ISearchConditions): Promise<factory.event.individualScreeningEvent.IEventWithOffer[]>;
    /**
     * 上映イベント情報取得
     */
    findIndividualScreeningEvent(params: {
        /**
         * イベント識別子
         */
        identifier: string;
    }): Promise<factory.event.individualScreeningEvent.IEventWithOffer>;
}
