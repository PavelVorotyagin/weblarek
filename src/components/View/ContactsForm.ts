import { EVENTS } from '../../utils/constants';
import { Form } from './Form';
import type { IEvents } from '../base/Events';
import type { IContactsFormView } from '../../types';

export class ContactsForm extends Form<IContactsFormView> {
    constructor(container: HTMLFormElement, events: IEvents) {
        super(container, events, EVENTS.orderSubmit);
    }

    set email(value: string) {
        this.setInput('email', value);
    }

    set phone(value: string) {
        this.setInput('phone', value);
    }
}
