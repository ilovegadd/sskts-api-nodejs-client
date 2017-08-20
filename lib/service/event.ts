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
        searchConditions: sskts.service.event.ISearchPerformancesConditions
    ): Promise<sskts.factory.event.individualScreeningEvent.IEvent[]> {
        return await apiRequest({
            baseUrl: this.options.endpoint,
            uri: '/events/individualScreeningEvent',
            qs: searchConditions,
            auth: { bearer: await this.options.auth.getAccessToken() },
            method: 'GET',
            expectedStatusCodes: [OK]
        });
    }

    /**
     * 上映イベント情報取得
     * 存在しなければnullを返します。
     */
    public async findIndividualScreeningEvent(args: {
        /**
         * イベント識別子
         */
        identifier: string;
    }): Promise<sskts.factory.event.individualScreeningEvent.IEvent | null> {
        return await apiRequest({
            baseUrl: this.options.endpoint,
            uri: `/events/individualScreeningEvent/${args.identifier}`,
            auth: { bearer: await this.options.auth.getAccessToken() },
            method: 'GET',
            expectedStatusCodes: [OK, NOT_FOUND]
        });
    }
}
