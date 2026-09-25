import { Form } from './Form';
import type { IEvents } from '../base/Events';
import type { IContactsFormView } from '../../types';
import { EVENTS } from '../../utils/constants';
import { ensureElement } from '../../utils/utils';

export class ContactsForm extends Form<IContactsFormView> {
    protected emailInput: HTMLInputElement;
    protected phoneInput: HTMLInputElement;

    constructor(container: HTMLFormElement, events: IEvents) {
        super(container, events, EVENTS.orderSubmit);
        this.emailInput = ensureElement<HTMLInputElement>('[name="email"]', container);
        this.phoneInput = ensureElement<HTMLInputElement>('[name="phone"]', container);
        this.emailInput.addEventListener('input', () => events.emit(EVENTS.buyerChange, { email: this.emailInput.value }));
        this.phoneInput.addEventListener('input', () => events.emit(EVENTS.buyerChange, { phone: this.phoneInput.value }));
    }

    set email(value: string) {
        this.emailInput.value = value;
    }

    set phone(value: string) {
        this.phoneInput.value = value;
    }
}
