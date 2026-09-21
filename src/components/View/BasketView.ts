import { EVENTS } from '../../utils/constants';
import { Component } from '../base/Component';
import type { IEvents } from '../base/Events';
import type { IBasketComponent, IBasketView } from '../../types';
import { ensureElement } from '../../utils/utils';

export class BasketView extends Component<IBasketView> implements IBasketComponent {
    protected list: HTMLElement;
    protected totalElement: HTMLElement;
    protected button: HTMLButtonElement;

    constructor(container: HTMLElement, events: IEvents) {
        super(container);
        this.list = ensureElement('.basket__list', container);
        this.totalElement = ensureElement('.basket__price', container);
        this.button = ensureElement<HTMLButtonElement>('.basket__button', container);
        this.button.addEventListener('click', () => events.emit(EVENTS.orderOpen));
    }

    set items(value: HTMLElement[]) {
        this.list.replaceChildren(...value);
        this.button.disabled = value.length === 0;
        if (!value.length) {
            const empty = document.createElement('li');
            empty.className = 'basket__empty';
            empty.textContent = 'Корзина пуста';
            this.list.append(empty);
        }
    }

    set total(value: number) {
        this.totalElement.textContent = `${value} синапсов`;
    }

    focusAfterRemoval(index: number): void {
        const buttons = this.list.querySelectorAll<HTMLButtonElement>('.basket__item-delete');
        (buttons[Math.min(index, buttons.length - 1)] ?? this.container).focus();
    }
}
