/**
 * 人物サービス
 *
 * @namespace service.person
 */
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
}
