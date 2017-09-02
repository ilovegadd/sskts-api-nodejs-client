/**
 * 注文取引サービス
 *
 * @namespace service.transaction.placeOrder
 */
import * as factory from '@motionpicture/sskts-factory';
import { Service } from '../../service';
export declare type ICreditCard = factory.paymentMethod.paymentCard.creditCard.IUncheckedCardRaw | factory.paymentMethod.paymentCard.creditCard.IUncheckedCardTokenized | factory.paymentMethod.paymentCard.creditCard.IUnauthorizedCardOfMember;
export interface IAuthorization {
    id: string;
    price: number;
}
/**
 * placeOrder transaction service
 *
 * @class PlaceOrderTransactionService
 */
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
    }): Promise<factory.transaction.placeOrder.ITransaction>;
    /**
     * 取引に座席予約を追加する
     */
    createSeatReservationAuthorization(params: {
        /**
         * transaction ID
         */
        transactionId: string;
        /**
         * イベント識別子
         */
        eventIdentifier: string;
        /**
         * 座席販売情報
         */
        offers: factory.offer.ISeatReservationOffer[];
    }): Promise<factory.action.authorize.seatReservation.IAction>;
    /**
     * 座席予約取消
     */
    cancelSeatReservationAuthorization(params: {
        /**
         * transaction ID
         */
        transactionId: string;
        /**
         * authorization ID
         */
        authorizationId: string;
    }): Promise<void>;
    /**
     * クレジットカードのオーソリを取得する
     */
    createCreditCardAuthorization(params: {
        /**
         * transaction ID
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
        method: string;
        /**
         * クレジットカード情報
         */
        creditCard: ICreditCard;
    }): Promise<IAuthorization>;
    /**
     * クレジットカードオーソリ取消
     */
    cancelCreditCardAuthorization(params: {
        /**
         * transaction ID
         */
        transactionId: string;
        /**
         * authorization ID
         */
        authorizationId: string;
    }): Promise<void>;
    /**
     * 決済方法として、ムビチケを追加する
     */
    createMvtkAuthorization(params: {
        /**
         * transaction ID
         */
        transactionId: string;
        /**
         * ムビチケ情報
         */
        mvtk: factory.action.authorize.mvtk.IObject;
    }): Promise<IAuthorization>;
    /**
     * ムビチケ取消
     */
    cancelMvtkAuthorization(params: {
        /**
         * transaction ID
         */
        transactionId: string;
        /**
         * authorization ID
         */
        authorizationId: string;
    }): Promise<void>;
    /**
     * register a customer contact
     */
    setCustomerContact(params: {
        /**
         * transaction ID
         */
        transactionId: string;
        /**
         * customer contact info
         */
        contact: factory.transaction.placeOrder.ICustomerContact;
    }): Promise<void>;
    /**
     * 取引確定
     */
    confirm(params: {
        /**
         * transaction ID
         */
        transactionId: string;
    }): Promise<factory.order.IOrder>;
    /**
     * 確定した取引に関して、購入者にメール通知を送信する
     */
    sendEmailNotification(params: {
        /**
         * transaction ID
         */
        transactionId: string;
        /**
         * Eメール通知
         */
        emailNotification: factory.notification.email.IData;
    }): Promise<factory.order.IOrder>;
}
