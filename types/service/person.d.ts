/**
 * 人物サービス
 *
 * @namespace service.person
 */
import * as sskts from '@motionpicture/sskts-domain';
import { Service } from '../service';
export interface IPresavedCreditCardRaw {
    cardNo: string;
    cardPass?: string;
    expire: string;
    holderName: string;
}
export interface IPresavedCreditCardTokenized {
    token: string;
}
export declare class PersonService extends Service {
    /**
     * プロフィール取得
     */
    getProfile(params: {
        /**
         * 人物ID
         * ログイン中の人物の場合、'me'を指定してください。
         */
        personId: string;
    }): Promise<sskts.factory.person.IProfile>;
    /**
     * プロフィール変更
     */
    updateProfile(params: {
        /**
         * 人物ID
         * ログイン中の人物の場合、'me'を指定してください。
         */
        personId: string;
        /**
         * プロフィール
         */
        profile: sskts.factory.person.IProfile;
    }): Promise<void>;
    /**
     * クレジットカード検索
     */
    findCreditCards(params: {
        /**
         * 人物ID
         * ログイン中の人物の場合、'me'を指定してください。
         */
        personId: string;
    }): Promise<sskts.GMO.services.card.ISearchCardResult[]>;
    /**
     * クレジットカード追加
     */
    addCreditCard(params: {
        /**
         * 人物ID
         * ログイン中の人物の場合、'me'を指定してください。
         */
        personId: string;
        /**
         * クレジットカード情報
         */
        creditCard: IPresavedCreditCardRaw | IPresavedCreditCardTokenized;
    }): Promise<sskts.GMO.services.card.ISearchCardResult>;
}
