/**
 * 人物サービス
 *
 * @namespace service.person
 */

// import * as sskts from '@motionpicture/sskts-domain';
// import { CREATED, NO_CONTENT, OK } from 'http-status';
// import apiRequest from '../apiRequest';

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
}
