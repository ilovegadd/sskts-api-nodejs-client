/**
 * 人物サービス
 *
 * @namespace service.person
 */
import * as sskts from '@motionpicture/sskts-domain';
import OAuth2client from '../auth/oAuth2client';
/**
 * プロフィール取得
 */
export declare function getProfile(args: {
    auth: OAuth2client;
    /**
     * 人物ID
     * ログイン中の人物の場合、'me'を指定してください。
     */
    personId: string;
}): Promise<sskts.factory.person.IProfile>;
/**
 * プロフィール変更
 */
export declare function updateProfile(args: {
    auth: OAuth2client;
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
export declare function findCreditCards(args: {
    auth: OAuth2client;
    /**
     * 人物ID
     * ログイン中の人物の場合、'me'を指定してください。
     */
    personId: string;
}): Promise<sskts.GMO.services.card.ISearchCardResult[]>;
export interface IPresavedCreditCardRaw {
    cardNo: string;
    cardPass?: string;
    expire: string;
    holderName: string;
}
export interface IPresavedCreditCardTokenized {
    token: string;
}
/**
 * クレジットカード追加
 */
export declare function addCreditCard(args: {
    auth: OAuth2client;
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
