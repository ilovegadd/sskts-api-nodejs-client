/**
 * 注文サービス
 *
 * @namespace service.order
 */

import * as factory from '@motionpicture/sskts-factory';
import { OK } from 'http-status';
import apiFetch from '../apiFetch';

import { Service } from '../service';

/**
 * order service
 *
 * @class OrderService
 */
export class OrderService extends Service {
    /**
     * 照会キーで注文情報を取得する
     */
    public async findByOrderInquiryKey(
        /**
         * 注文照会キー
         */
        params: factory.order.IOrderInquiryKey
    ): Promise<factory.order.IOrder> {
        return apiFetch({
            auth: this.options.auth,
            baseUrl: this.options.endpoint,
            uri: '/orders/findByOrderInquiryKey',
            method: 'POST',
            body: params,
            expectedStatusCodes: [OK]
        });
    }
}
