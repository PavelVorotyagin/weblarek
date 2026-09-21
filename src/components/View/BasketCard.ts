import { EVENTS } from '../../utils/constants';
import { Card } from './Card';
import type { IEvents } from '../base/Events';
import { ensureElement } from '../../utils/utils';

export class BasketCard extends Card {
    protected indexElement: HTMLElement;
    protected button: HTMLButtonElement;

    constructor(container: HTMLElement, events: IEvents) {
        super(container);
        this.indexElement = ensureElement('.basket__item-index', container);
        this.button = ensureElement<HTMLButtonElement>('.basket__item-delete', container);
        this.button.addEventListener('click', () => events.emit(EVENTS.basketRemove, { id: this.productId }));
    }

    set index(value: number) {
        this.indexElement.textContent = String(value);
    }

    set title(value: string) {
        super.title = value;
        this.button.setAttribute('aria-label', `Удалить ${value}`);
    }
}
