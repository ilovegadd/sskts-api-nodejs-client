/**
 * イベントサービス
 *
 * @namespace service.event
 */
import * as sskts from '@motionpicture/sskts-domain';
import OAuth2client from '../auth/oAuth2client';
/**
 * 上映イベント検索
 */
export declare function searchIndividualScreeningEvent(args: {
    auth: OAuth2client;
    /**
     * 検索条件
     */
    searchConditions: sskts.service.event.ISearchPerformancesConditions;
}): Promise<sskts.factory.event.individualScreeningEvent.IEvent[]>;
/**
 * 上映イベント情報取得
 * 存在しなければnullを返します。
 */
export declare function findIndividualScreeningEvent(args: {
    auth: OAuth2client;
    /**
     * イベント識別子
     */
    identifier: string;
}): Promise<sskts.factory.event.individualScreeningEvent.IEvent | null>;
