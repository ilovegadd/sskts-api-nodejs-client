/**
 * 注文取引サービス
 *
 * @namespace service.transaction.placeOrder
 */

import * as factory from '@motionpicture/sskts-factory';
import { CREATED, NO_CONTENT, NOT_FOUND, OK } from 'http-status';
import apiRequest from '../../apiRequest';

import { Service } from '../../service';

export type IMvtk = factory.authorization.mvtk.IResult & {
    price: number;
};

export type ICreditCard =
    factory.paymentMethod.paymentCard.creditCard.IUncheckedCardRaw | factory.paymentMethod.paymentCard.creditCard.IUncheckedCardTokenized;

export class PlaceOrderTransactionService extends Service {
    /**
     * 取引を開始する
     * 開始できない場合(混雑中など)、nullが返されます。
     */
    public async start(params: {
        /**
         * 取引期限
         * 指定した日時を過ぎると、取引を進行することはできなくなります。
         */
        expires: Date;
        /**
         * 販売者ID
         */
        sellerId: string;
    }): Promise<factory.transaction.placeOrder.ITransaction> {
        return await apiRequest({
            baseUrl: this.options.endpoint,
            uri: '/transactions/placeOrder/start',
            method: 'POST',
            expectedStatusCodes: [NOT_FOUND, OK],
            auth: this.options.auth,
            body: {
                expires: params.expires.valueOf(),
                sellerId: params.sellerId
            }
        });
    }

    /**
     * 取引に座席予約を追加する
     */
    public async createSeatReservationAuthorization(params: {
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
        offers: factory.offer.ISeatReservationOffer[];
    }): Promise<factory.authorization.seatReservation.IAuthorization> {
        return await apiRequest({
            baseUrl: this.options.endpoint,
            uri: `/transactions/placeOrder/${params.transactionId}/seatReservationAuthorization`,
            method: 'POST',
            expectedStatusCodes: [CREATED],
            auth: this.options.auth,
            body: {
                eventIdentifier: params.eventIdentifier,
                offers: params.offers
            }
        });
    }

    /**
     * 座席予約取消
     */
    public async cancelSeatReservationAuthorization(params: {
        /**
         * 取引ID
         */
        transactionId: string;
        /**
         * 承認ID
         */
        authorizationId: string;
    }): Promise<void> {
        return await apiRequest({
            baseUrl: this.options.endpoint,
            uri: `/transactions/placeOrder/${params.transactionId}/seatReservationAuthorization/${params.authorizationId}`,
            method: 'DELETE',
            expectedStatusCodes: [NO_CONTENT],
            auth: this.options.auth
        });
    }

    /**
     * クレジットカードのオーソリを取得する
     */
    public async createCreditCardAuthorization(params: {
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
        method: string;
        /**
         * クレジットカード情報
         */
        creditCard: ICreditCard;
    }): Promise<factory.authorization.gmo.IAuthorization> {
        return await apiRequest({
            baseUrl: this.options.endpoint,
            uri: `/transactions/placeOrder/${params.transactionId}/paymentInfos/creditCard`,
            method: 'POST',
            expectedStatusCodes: [CREATED],
            auth: this.options.auth,
            body: {
                orderId: params.orderId,
                amount: params.amount,
                method: params.method,
                creditCard: params.creditCard
            }
        });
    }

    /**
     * クレジットカードオーソリ取消
     */
    public async cancelCreditCardAuthorization(params: {
        /**
         * 取引ID
         */
        transactionId: string;
        /**
         * 承認ID
         */
        authorizationId: string;
    }): Promise<void> {
        return await apiRequest({
            baseUrl: this.options.endpoint,
            uri: `/transactions/placeOrder/${params.transactionId}/paymentInfos/creditCard/${params.authorizationId}`,
            method: 'DELETE',
            expectedStatusCodes: [NO_CONTENT],
            auth: this.options.auth
        });
    }

    /**
     * 決済方法として、ムビチケを追加する
     */
    public async createMvtkAuthorization(params: {
        /**
         * 取引ID
         */
        transactionId: string;
        /**
         * ムビチケ情報
         */
        mvtk: IMvtk;
    }): Promise<factory.authorization.mvtk.IAuthorization> {
        return await apiRequest({
            baseUrl: this.options.endpoint,
            uri: `/transactions/placeOrder/${params.transactionId}/paymentInfos/mvtk`,
            method: 'POST',
            expectedStatusCodes: [CREATED],
            auth: this.options.auth,
            body: params.mvtk
        });
    }

    /**
     * ムビチケ取消
     */
    public async cancelMvtkAuthorization(params: {
        /**
         * 取引ID
         */
        transactionId: string;
        /**
         * 承認ID
         */
        authorizationId: string;
    }): Promise<void> {
        return await apiRequest({
            baseUrl: this.options.endpoint,
            uri: `/transactions/placeOrder/${params.transactionId}/paymentInfos/mvtk/${params.authorizationId}`,
            method: 'DELETE',
            expectedStatusCodes: [NO_CONTENT],
            auth: this.options.auth
        });
    }

    /**
     * 購入者情報登録
     */
    public async setAgentProfile(params: {
        /**
         * 取引ID
         */
        transactionId: string;
        /**
         * 購入者情報
         */
        profile: factory.transaction.placeOrder.ICustomerContact;
    }): Promise<void> {
        await apiRequest({
            baseUrl: this.options.endpoint,
            uri: `/transactions/placeOrder/${params.transactionId}/agent/profile`,
            method: 'PUT',
            expectedStatusCodes: [NO_CONTENT],
            auth: this.options.auth,
            body: params.profile
        });
    }

    /**
     * 取引確定
     */
    public async confirm(params: {
        /**
         * 取引ID
         */
        transactionId: string;
    }): Promise<factory.order.IOrder> {
        return await apiRequest({
            baseUrl: this.options.endpoint,
            uri: `/transactions/placeOrder/${params.transactionId}/confirm`,
            method: 'POST',
            expectedStatusCodes: [CREATED],
            auth: this.options.auth
        });
    }

    /**
     * 確定した取引に関して、購入者にメール通知を送信する
     */
    public async sendEmailNotification(params: {
        /**
         * 取引ID
         */
        transactionId: string;
        /**
         * Eメール通知
         */
        emailNotification: factory.notification.email.INotification
    }): Promise<factory.order.IOrder> {
        return await apiRequest({
            baseUrl: this.options.endpoint,
            uri: `/transactions/placeOrder/${params.transactionId}/tasks/sendEmailNotification`,
            method: 'POST',
            expectedStatusCodes: [NO_CONTENT],
            auth: this.options.auth,
            body: params.emailNotification
        });
    }
}
