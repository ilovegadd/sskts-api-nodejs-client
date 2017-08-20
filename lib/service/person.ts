/**
 * 人物サービス
 *
 * @namespace service.person
 */

import * as sskts from '@motionpicture/sskts-domain';
import { CREATED, NO_CONTENT, OK } from 'http-status';
import apiRequest from '../apiRequest';

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

export class PersonService extends Service {
    /**
     * プロフィール取得
     */
    public async getProfile(params: {
        /**
         * 人物ID
         * ログイン中の人物の場合、'me'を指定してください。
         */
        personId: string;
    }): Promise<sskts.factory.person.IProfile> {
        return await apiRequest({
            auth: this.options.auth,
            baseUrl: this.options.endpoint,
            uri: `/people/${params.personId}/profile`,
            method: 'GET',
            expectedStatusCodes: [OK]
        });
    }

    /**
     * プロフィール変更
     */
    public async updateProfile(params: {
        /**
         * 人物ID
         * ログイン中の人物の場合、'me'を指定してください。
         */
        personId: string;
        /**
         * プロフィール
         */
        profile: sskts.factory.person.IProfile
    }): Promise<void> {
        return await apiRequest({
            auth: this.options.auth,
            baseUrl: this.options.endpoint,
            uri: `/people/${params.personId}/profile`,
            body: params.profile,
            method: 'PUT',
            expectedStatusCodes: [NO_CONTENT]
        });
    }

    /**
     * クレジットカード検索
     */
    public async findCreditCards(params: {
        /**
         * 人物ID
         * ログイン中の人物の場合、'me'を指定してください。
         */
        personId: string;
    }): Promise<sskts.GMO.services.card.ISearchCardResult[]> {
        return await apiRequest({
            auth: this.options.auth,
            baseUrl: this.options.endpoint,
            uri: `/people/${params.personId}/creditCards`,
            method: 'GET',
            expectedStatusCodes: [OK]
        });
    }

    /**
     * クレジットカード追加
     */
    public async addCreditCard(params: {
        /**
         * 人物ID
         * ログイン中の人物の場合、'me'を指定してください。
         */
        personId: string;
        /**
         * クレジットカード情報
         */
        creditCard: IPresavedCreditCardRaw | IPresavedCreditCardTokenized
    }): Promise<sskts.GMO.services.card.ISearchCardResult> {
        return await apiRequest({
            auth: this.options.auth,
            baseUrl: this.options.endpoint,
            uri: `/people/${params.personId}/creditCards`,
            body: params.creditCard,
            method: 'POST',
            expectedStatusCodes: [CREATED]
        });
    }
}
