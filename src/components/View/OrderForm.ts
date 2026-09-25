import { Form } from './Form';
import type { IEvents } from '../base/Events';
import type { IOrderFormView, TPayment } from '../../types';
import { EVENTS } from '../../utils/constants';
import { ensureElement } from '../../utils/utils';

export class OrderForm extends Form<IOrderFormView> {
    protected addressInput: HTMLInputElement;
    protected cardButton: HTMLButtonElement;
    protected cashButton: HTMLButtonElement;

    constructor(container: HTMLFormElement, events: IEvents) {
        super(container, events, EVENTS.orderNext);
        this.addressInput = ensureElement<HTMLInputElement>('[name="address"]', container);
        this.cardButton = ensureElement<HTMLButtonElement>('[name="card"]', container);
        this.cashButton = ensureElement<HTMLButtonElement>('[name="cash"]', container);
        this.addressInput.addEventListener('input', () => events.emit(EVENTS.buyerChange, { address: this.addressInput.value }));
        this.cardButton.addEventListener('click', () => events.emit(EVENTS.buyerChange, { payment: 'card' }));
        this.cashButton.addEventListener('click', () => events.emit(EVENTS.buyerChange, { payment: 'cash' }));
    }

    set address(value: string) {
        this.addressInput.value = value;
    }

    set payment(value: TPayment) {
        this.cardButton.classList.toggle('button_alt-active', value === 'card');
        this.cashButton.classList.toggle('button_alt-active', value === 'cash');
    }
}
