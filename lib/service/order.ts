/**
 * 注文サービス
 *
 * @namespace service.order
 */

import * as sskts from '@motionpicture/sskts-domain';
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
        orderInquiryKey: sskts.factory.orderInquiryKey.IOrderInquiryKey
    ): Promise<sskts.factory.order.IOrder | null> {
        return await apiRequest({
            baseUrl: this.options.endpoint,
            uri: '/orders/findByOrderInquiryKey',
            method: 'POST',
            expectedStatusCodes: [NOT_FOUND, OK],
            auth: { bearer: await this.options.auth.getAccessToken() },
            body: orderInquiryKey
        });
    }
}
