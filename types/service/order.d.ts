/**
 * 注文サービス
 *
 * @namespace service.order
 */
import * as sskts from '@motionpicture/sskts-domain';
import OAuth2client from '../auth/oAuth2client';
/**
 * 照会キーで注文情報を取得する
 * 存在しなければnullを返します。
 */
export declare function findByOrderInquiryKey(args: {
    auth: OAuth2client;
    /**
     * 注文照会キー
     */
    orderInquiryKey: sskts.factory.orderInquiryKey.IOrderInquiryKey;
}): Promise<sskts.factory.order.IOrder | null>;
