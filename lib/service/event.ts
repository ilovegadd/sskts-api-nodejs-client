/**
 * イベントサービス
 *
 * @namespace service.event
 */

import * as sskts from '@motionpicture/sskts-domain';
import { NOT_FOUND, OK } from 'http-status';
import apiRequest from '../apiRequest';

import { Service } from '../service';

export class EventService extends Service {
    /**
     * 上映イベント検索
     */
    public async searchIndividualScreeningEvent(
        /**
         * 検索条件
         */
        params: sskts.service.event.ISearchPerformancesConditions
    ): Promise<sskts.factory.event.individualScreeningEvent.IEvent[]> {
        return await apiRequest({
            baseUrl: this.options.endpoint,
            uri: '/events/individualScreeningEvent',
            auth: this.options.auth,
            method: 'GET',
            expectedStatusCodes: [OK],
            qs: params
        });
    }

    /**
     * 上映イベント情報取得
     * 存在しなければnullを返します。
     */
    public async findIndividualScreeningEvent(params: {
        /**
         * イベント識別子
         */
        identifier: string;
    }): Promise<sskts.factory.event.individualScreeningEvent.IEvent | null> {
        return await apiRequest({
            baseUrl: this.options.endpoint,
            uri: `/events/individualScreeningEvent/${params.identifier}`,
            auth: this.options.auth,
            method: 'GET',
            expectedStatusCodes: [OK, NOT_FOUND]
        });
    }
}
