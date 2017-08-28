/**
 * 注文サービス
 *
 * @namespace service.order
 */
import * as factory from '@motionpicture/sskts-factory';
import { Service } from '../service';
/**
 * order service
 *
 * @class OrderService
 */
export declare class OrderService extends Service {
    /**
     * 照会キーで注文情報を取得する
     */
    findByOrderInquiryKey(
        /**
         * 注文照会キー
         */
        params: factory.order.IOrderInquiryKey): Promise<factory.order.IOrder>;
}
