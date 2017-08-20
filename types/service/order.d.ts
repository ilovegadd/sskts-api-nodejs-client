/**
 * 注文サービス
 *
 * @namespace service.order
 */
import * as sskts from '@motionpicture/sskts-domain';
import { Service } from '../service';
export declare class OrderService extends Service {
    /**
     * 照会キーで注文情報を取得する
     * 存在しなければnullを返します。
     */
    findByOrderInquiryKey(
        /**
         * 注文照会キー
         */
        orderInquiryKey: sskts.factory.orderInquiryKey.IOrderInquiryKey): Promise<sskts.factory.order.IOrder | null>;
}
