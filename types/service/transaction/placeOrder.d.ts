/**
 * 注文取引サービス
 *
 * @namespace service.transaction.placeOrder
 */
import * as sskts from '@motionpicture/sskts-domain';
import { Service } from '../../service';
export declare type IMvtk = sskts.factory.authorization.mvtk.IResult & {
    price: number;
};
export interface IEmailNotification {
    from: string;
    to: string;
    subject: string;
    content: string;
}
export declare class PlaceOrderTransactionService extends Service {
    /**
     * 取引を開始する
     * 開始できない場合(混雑中など)、nullが返されます。
     */
    start(params: {
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
    createSeatReservationAuthorization(params: {
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
    cancelSeatReservationAuthorization(params: {
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
    createCreditCardAuthorization(params: {
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
    cancelCreditCardAuthorization(params: {
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
     * 決済方法として、ムビチケを追加する
     */
    createMvtkAuthorization(params: {
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
    cancelMvtkAuthorization(params: {
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
    setAgentProfile(params: {
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
    confirm(params: {
        /**
         * 取引ID
         */
        transactionId: string;
    }): Promise<sskts.factory.order.IOrder>;
    /**
     * 確定した取引に関して、購入者にメール通知を送信する
     */
    sendEmailNotification(params: {
        /**
         * 取引ID
         */
        transactionId: string;
        /**
         * Eメール通知
         */
        emailNotification: IEmailNotification;
    }): Promise<sskts.factory.order.IOrder>;
}
