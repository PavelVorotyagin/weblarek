import { Component } from '../base/Component';
import type { IEvents } from '../base/Events';
import type { IBasketView } from '../../types';
import { EVENTS } from '../../utils/constants';
import { ensureElement } from '../../utils/utils';

export class BasketView extends Component<IBasketView> {
    protected list: HTMLElement;
    protected totalElement: HTMLElement;
    protected button: HTMLButtonElement;

    constructor(container: HTMLElement, protected events: IEvents) {
        super(container);
        this.list = ensureElement('.basket__list', container);
        this.totalElement = ensureElement('.basket__price', container);
        this.button = ensureElement<HTMLButtonElement>('.basket__button', container);
        this.button.addEventListener('click', () => this.events.emit(EVENTS.orderOpen));
    }

    set items(value: HTMLElement[]) {
        this.list.replaceChildren(...value);
    }

    set total(value: number) {
        this.totalElement.textContent = `${value} синапсов`;
    }

    set disabled(value: boolean) {
        this.button.disabled = value;
    }
}
