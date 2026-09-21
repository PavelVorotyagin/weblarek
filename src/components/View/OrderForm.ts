import { EVENTS } from '../../utils/constants';
import { Form } from './Form';
import type { IEvents } from '../base/Events';
import type { IOrderFormView, TPayment } from '../../types';

export class OrderForm extends Form<IOrderFormView> {
    protected paymentButtons: HTMLButtonElement[];

    constructor(container: HTMLFormElement, events: IEvents) {
        super(container, events, EVENTS.orderNext);
        this.paymentButtons = Array.from(container.querySelectorAll<HTMLButtonElement>('.order__buttons button'));
        this.paymentButtons.forEach((button) => button.addEventListener('click', () => {
            events.emit(EVENTS.buyerChange, { payment: button.name });
        }));
    }

    set payment(value: TPayment) {
        this.paymentButtons.forEach((button) => {
            const selected = button.name === value;
            button.classList.toggle('button_alt-active', selected);
            button.setAttribute('aria-pressed', String(selected));
        });
    }

    set address(value: string) {
        this.setInput('address', value);
    }
}
