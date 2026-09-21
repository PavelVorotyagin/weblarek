import { EVENTS } from '../../utils/constants';
import { Card } from './Card';
import type { IEvents } from '../base/Events';
import { ensureElement } from '../../utils/utils';

export class PreviewCard extends Card {
    protected descriptionElement: HTMLElement;
    protected button: HTMLButtonElement;
    protected available = false;
    protected selected = false;

    constructor(container: HTMLElement, events: IEvents) {
        super(container);
        this.descriptionElement = ensureElement('.card__text', container);
        this.button = ensureElement<HTMLButtonElement>('.card__button', container);
        this.button.addEventListener('click', () => events.emit(EVENTS.productToggle, { id: this.productId }));
    }

    set description(value: string) {
        this.descriptionElement.textContent = value;
    }

    set price(value: number | null) {
        super.price = value;
        this.available = value !== null;
        this.updateButton();
    }

    set inBasket(value: boolean) {
        this.selected = value;
        this.updateButton();
    }

    protected updateButton(): void {
        this.button.disabled = !this.available;
        this.button.textContent = !this.available ? 'Недоступно'
            : this.selected ? 'Удалить из корзины' : 'Купить';
    }
}
