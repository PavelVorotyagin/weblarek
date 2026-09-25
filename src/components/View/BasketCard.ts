import { Card } from './Card';
import type { IBasketCardView } from '../../types';
import { ensureElement } from '../../utils/utils';

export class BasketCard extends Card<IBasketCardView> {
    protected indexElement: HTMLElement;
    protected button: HTMLButtonElement;

    constructor(container: HTMLElement, onClick: () => void) {
        super(container);
        this.indexElement = ensureElement('.basket__item-index', container);
        this.button = ensureElement<HTMLButtonElement>('.basket__item-delete', container);
        this.button.addEventListener('click', onClick);
    }

    set index(value: number) {
        this.indexElement.textContent = String(value);
    }
}
