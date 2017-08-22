/**
 * イベントサービス
 *
 * @namespace service.event
 */

import * as factory from '@motionpicture/sskts-factory';
import { NOT_FOUND, OK } from 'http-status';
import apiRequest from '../apiRequest';

import { Service } from '../service';

/**
 * event service
 *
 * @class EventService
 */
export class EventService extends Service {
    /**
     * 上映イベント検索
     */
    public async searchIndividualScreeningEvent(
        /**
         * 検索条件
         */
        params: factory.event.individualScreeningEvent.ISearchConditions
    ): Promise<factory.event.individualScreeningEvent.IEvent[]> {
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
    }): Promise<factory.event.individualScreeningEvent.IEvent | null> {
        return await apiRequest({
            baseUrl: this.options.endpoint,
            uri: `/events/individualScreeningEvent/${params.identifier}`,
            auth: this.options.auth,
            method: 'GET',
            expectedStatusCodes: [OK, NOT_FOUND]
        });
    }
}
