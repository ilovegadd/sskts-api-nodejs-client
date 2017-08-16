/**
 * 注文取引サービス
 *
 * @namespace service.transaction.placeOrder
 */
import * as sskts from '@motionpicture/sskts-domain';
import OAuth2client from '../../auth/oAuth2client';
/**
 * 取引を開始する
 * 開始できない場合(混雑中など)、nullが返されます。
 */
export declare function start(args: {
    auth: OAuth2client;
    /**
     * 取引期限
     * 指定した日時を過ぎると、取引を進行することはできなくなります。
     */
    expires: Date;
    /**
     * 販売者ID
     */
    sellerId: string;
}): Promise<sskts.factory.transaction.ITransaction>;
/**
 * 取引に座席予約を追加する
 */
export declare function createSeatReservationAuthorization(args: {
    auth: OAuth2client;
    /**
     * 取引ID
     */
    transactionId: string;
    /**
     * イベント識別子
     */
    eventIdentifier: string;
    /**
     * 座席販売情報
     */
    offers: sskts.service.transaction.placeOrder.ISeatReservationOffer[];
}): Promise<sskts.factory.authorization.seatReservation.IAuthorization>;
/**
 * 座席予約取消
 */
export declare function cancelSeatReservationAuthorization(args: {
    auth: OAuth2client;
    /**
     * 取引ID
     */
    transactionId: string;
    /**
     * 承認ID
     */
    authorizationId: string;
}): Promise<void>;
/**
 * クレジットカードのオーソリを取得する
 */
export declare function createCreditCardAuthorization(args: {
    auth: OAuth2client;
    /**
     * 取引ID
     */
    transactionId: string;
    /**
     * オーダーID
     */
    orderId: string;
    /**
     * 金額
     */
    amount: number;
    /**
     * 支払い方法
     */
    method: sskts.GMO.utils.util.Method;
    /**
     * クレジットカード情報
     */
    creditCard: sskts.service.transaction.placeOrder.ICreditCard4authorization;
}): Promise<sskts.factory.authorization.gmo.IAuthorization>;
/**
 * クレジットカードオーソリ取消
 */
export declare function cancelCreditCardAuthorization(args: {
    auth: OAuth2client;
    /**
     * 取引ID
     */
    transactionId: string;
    /**
     * 承認ID
     */
    authorizationId: string;
}): Promise<void>;
export declare type IMvtk = sskts.factory.authorization.mvtk.IResult & {
    price: number;
};
/**
 * 決済方法として、ムビチケを追加する
 */
export declare function createMvtkAuthorization(args: {
    auth: OAuth2client;
    /**
     * 取引ID
     */
    transactionId: string;
    /**
     * ムビチケ情報
     */
    mvtk: IMvtk;
}): Promise<sskts.factory.authorization.mvtk.IAuthorization>;
/**
 * ムビチケ取消
 */
export declare function cancelMvtkAuthorization(args: {
    auth: OAuth2client;
    /**
     * 取引ID
     */
    transactionId: string;
    /**
     * 承認ID
     */
    authorizationId: string;
}): Promise<void>;
/**
 * 購入者情報登録
 */
export declare function setAgentProfile(args: {
    auth: OAuth2client;
    /**
     * 取引ID
     */
    transactionId: string;
    /**
     * 購入者情報
     */
    profile: sskts.factory.person.IProfile;
}): Promise<void>;
/**
 * 取引確定
 */
export declare function confirm(args: {
    auth: OAuth2client;
    /**
     * 取引ID
     */
    transactionId: string;
}): Promise<sskts.factory.order.IOrder>;
export interface IEmailNotification {
    from: string;
    to: string;
    subject: string;
    content: string;
}
/**
 * 確定した取引に関して、購入者にメール通知を送信する
 */
export declare function sendEmailNotification(args: {
    auth: OAuth2client;
    /**
     * 取引ID
     */
    transactionId: string;
    /**
     * Eメール通知
     */
    emailNotification: IEmailNotification;
}): Promise<sskts.factory.order.IOrder>;
