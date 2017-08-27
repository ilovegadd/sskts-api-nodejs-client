import * as factory from '@motionpicture/sskts-factory';
import { Service } from '../service';
export declare type ICreditCard = factory.paymentMethod.paymentCard.creditCard.IUncheckedCardRaw | factory.paymentMethod.paymentCard.creditCard.IUncheckedCardTokenized;
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
     * @return {Promise<ISearchCardResult>} successfully created credit card info
     */
    addCreditCard(params: {
        /**
         * person id
         * basically specify 'me' to retrieve contacts of login user
         */
        personId: string;
        /**
         * credit card info
         */
        creditCard: ICreditCard;
    }): Promise<factory.paymentMethod.paymentCard.creditCard.ICheckedCard>;
    /**
     * search ownerships of reservations
     */
    searchReservationOwnerships(params: {
        /**
         * person id
         * basically specify 'me' to retrieve contacts of login user
         */
        personId: string;
    }): Promise<factory.ownershipInfo.IOwnershipInfo<factory.reservation.event.IEventReservation>[]>;
}
