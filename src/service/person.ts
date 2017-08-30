import * as factory from '@motionpicture/sskts-factory';
import { CREATED, NO_CONTENT, OK } from 'http-status';

import apiFetch from '../apiFetch';
import { Service } from '../service';

export type ICreditCard =
    factory.paymentMethod.paymentCard.creditCard.IUncheckedCardRaw | factory.paymentMethod.paymentCard.creditCard.IUncheckedCardTokenized;

export type IScreenEventReservation = factory.reservation.event.IEventReservation<factory.event.individualScreeningEvent.IEvent>;

/**
 * person service
 *
 * @class PersonService
 */
export class PersonService extends Service {
    /**
     * retrieve user contacts
     */
    public async getContacts(params: {
        /**
         * person id
         * basically specify 'me' to retrieve contacts of login user
         */
        personId: string;
    }): Promise<factory.person.IContact> {
        return apiFetch({
            auth: this.options.auth,
            baseUrl: this.options.endpoint,
            uri: `/people/${params.personId}/contacts`,
            method: 'GET',
            qs: {},
            expectedStatusCodes: [OK]
        });
    }

    /**
     * update contacts
     */
    public async updateContacts(params: {
        /**
         * person id
         * basically specify 'me' to retrieve contacts of login user
         */
        personId: string;
        /**
         * contacts
         */
        contacts: factory.person.IContact
    }): Promise<void> {
        return apiFetch({
            auth: this.options.auth,
            baseUrl: this.options.endpoint,
            uri: `/people/${params.personId}/contacts`,
            method: 'PUT',
            body: params.contacts,
            expectedStatusCodes: [NO_CONTENT]
        });
    }

    /**
     * find credit cards
     * クレジットカード検索
     * @see example /example/person/handleCreditCards
     */
    public async findCreditCards(params: {
        /**
         * person id
         * basically specify 'me' to retrieve contacts of login user
         */
        personId: string;
    }): Promise<factory.paymentMethod.paymentCard.creditCard.ICheckedCard[]> {
        return apiFetch({
            auth: this.options.auth,
            baseUrl: this.options.endpoint,
            uri: `/people/${params.personId}/creditCards`,
            method: 'GET',
            qs: {},
            expectedStatusCodes: [OK]
        });
    }

    /**
     * add a credit card
     * クレジットカード追加
     * @return {Promise<ISearchCardResult>} successfully created credit card info
     * @see example /example/person/handleCreditCards
     */
    public async addCreditCard(params: {
        /**
         * person id
         * basically specify 'me' to retrieve contacts of login user
         */
        personId: string;
        /**
         * credit card info
         * クレジットカード情報(情報の渡し方にはいくつかパターンがあるので、型を参照すること)
         */
        creditCard: ICreditCard
    }): Promise<factory.paymentMethod.paymentCard.creditCard.ICheckedCard> {
        return apiFetch({
            auth: this.options.auth,
            baseUrl: this.options.endpoint,
            uri: `/people/${params.personId}/creditCards`,
            method: 'POST',
            body: params.creditCard,
            expectedStatusCodes: [CREATED]
        });
    }

    /**
     * delete a credit card by cardSeq
     * クレジットカード削除
     * @return {Promise<void>}
     * @see example /example/person/handleCreditCards
     */
    public async deleteCreditCard(params: {
        /**
         * person id
         * basically specify 'me' to retrieve contacts of login user
         */
        personId: string;
        /**
         * cardSeq
         * カード連番
         */
        cardSeq: string
    }): Promise<void> {
        return apiFetch({
            auth: this.options.auth,
            baseUrl: this.options.endpoint,
            uri: `/people/${params.personId}/creditCards/${params.cardSeq}`,
            method: 'DELETE',
            expectedStatusCodes: [NO_CONTENT]
        });
    }

    /**
     * search ownerships of reservations
     */
    public async searchReservationOwnerships(params: {
        /**
         * person id
         * basically specify 'me' to retrieve contacts of login user
         */
        personId: string;
    }): Promise<factory.ownershipInfo.IOwnershipInfo<IScreenEventReservation>[]> {
        return apiFetch({
            auth: this.options.auth,
            baseUrl: this.options.endpoint,
            uri: `/people/${params.personId}/ownershipInfos/reservation`,
            method: 'GET',
            qs: {},
            expectedStatusCodes: [OK]
        });
    }
}
