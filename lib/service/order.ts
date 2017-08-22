/**
 * 注文サービス
 *
 * @namespace service.order
 */

import * as factory from '@motionpicture/sskts-factory';
import { NOT_FOUND, OK } from 'http-status';
import apiRequest from '../apiRequest';

import { Service } from '../service';

export class OrderService extends Service {
    /**
     * 照会キーで注文情報を取得する
     * 存在しなければnullを返します。
     */
    public async findByOrderInquiryKey(
        /**
         * 注文照会キー
         */
        params: factory.order.IOrderInquiryKey
    ): Promise<factory.order.IOrder | null> {
        return await apiRequest({
            auth: this.options.auth,
            baseUrl: this.options.endpoint,
            uri: '/orders/findByOrderInquiryKey',
            method: 'POST',
            expectedStatusCodes: [NOT_FOUND, OK],
            body: params
        });
    }
}
