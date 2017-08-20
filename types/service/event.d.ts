/**
 * イベントサービス
 *
 * @namespace service.event
 */
import * as sskts from '@motionpicture/sskts-domain';
import { Service } from '../service';
export declare class EventService extends Service {
    /**
     * 上映イベント検索
     */
    searchIndividualScreeningEvent(
        /**
         * 検索条件
         */
        searchConditions: sskts.service.event.ISearchPerformancesConditions): Promise<sskts.factory.event.individualScreeningEvent.IEvent[]>;
    /**
     * 上映イベント情報取得
     * 存在しなければnullを返します。
     */
    findIndividualScreeningEvent(args: {
        /**
         * イベント識別子
         */
        identifier: string;
    }): Promise<sskts.factory.event.individualScreeningEvent.IEvent | null>;
}
