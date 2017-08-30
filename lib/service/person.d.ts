import * as factory from '@motionpicture/sskts-factory';
import { Service } from '../service';
export declare type ICreditCard = factory.paymentMethod.paymentCard.creditCard.IUncheckedCardRaw | factory.paymentMethod.paymentCard.creditCard.IUncheckedCardTokenized;
export declare type IScreenEventReservation = factory.reservation.event.IEventReservation<factory.event.individualScreeningEvent.IEvent>;
/**
 * person service
 *
 * @class PersonService
 */
export declare class PersonService extends Service {
    /**
     * retrieve user contacts
     */
    getContacts(params: {
        /**
         * person id
         * basically specify 'me' to retrieve contacts of login user
         */
        personId: string;
    }): Promise<factory.person.IContact>;
    /**
     * update contacts
     */
    updateContacts(params: {
        /**
         * person id
         * basically specify 'me' to retrieve contacts of login user
         */
        personId: string;
        /**
         * contacts
         */
        contacts: factory.person.IContact;
    }): Promise<void>;
    /**
     * find credit cards
     * クレジットカード検索
     * @see example /example/person/handleCreditCards
     */
    findCreditCards(params: {
        /**
         * person id
         * basically specify 'me' to retrieve contacts of login user
         */
        personId: string;
    }): Promise<factory.paymentMethod.paymentCard.creditCard.ICheckedCard[]>;
    /**
     * add a credit card
     * クレジットカード追加
     * @return {Promise<ISearchCardResult>} successfully created credit card info
     * @see example /example/person/handleCreditCards
     */
    addCreditCard(params: {
        /**
         * person id
         * basically specify 'me' to retrieve contacts of login user
         */
        personId: string;
        /**
         * credit card info
         * クレジットカード情報(情報の渡し方にはいくつかパターンがあるので、型を参照すること)
         */
        creditCard: ICreditCard;
    }): Promise<factory.paymentMethod.paymentCard.creditCard.ICheckedCard>;
    /**
     * delete a credit card by cardSeq
     * クレジットカード削除
     * @return {Promise<void>}
     * @see example /example/person/handleCreditCards
     */
    deleteCreditCard(params: {
        /**
         * person id
         * basically specify 'me' to retrieve contacts of login user
         */
        personId: string;
        /**
         * cardSeq
         * カード連番
         */
        cardSeq: string;
    }): Promise<void>;
    /**
     * search ownerships of reservations
     */
    searchReservationOwnerships(params: {
        /**
         * person id
         * basically specify 'me' to retrieve contacts of login user
         */
        personId: string;
    }): Promise<factory.ownershipInfo.IOwnershipInfo<IScreenEventReservation>[]>;
}
