import { Component } from '../base/Component';
import type { IProduct } from '../../types';
import { categoryMap } from '../../utils/constants';
import { ensureElement } from '../../utils/utils';

export abstract class Card<T extends Pick<IProduct, 'title' | 'price'>> extends Component<T> {
    protected titleElement: HTMLElement;
    protected priceElement: HTMLElement;
    protected categoryElement: HTMLElement | null;
    protected imageElement: HTMLImageElement | null;

    protected constructor(container: HTMLElement) {
        super(container);
        this.titleElement = ensureElement('.card__title', container);
        this.priceElement = ensureElement('.card__price', container);
        this.categoryElement = container.querySelector('.card__category');
        this.imageElement = container.querySelector('.card__image');
    }

    set title(value: string) {
        this.titleElement.textContent = value;
        if (this.imageElement) this.imageElement.alt = value;
    }

    set price(value: number | null) {
        this.priceElement.textContent = value === null ? 'Бесценно' : `${value} синапсов`;
    }

    set category(value: string) {
        const category = this.categoryElement;
        if (!category) return;
        category.textContent = value;
        category.classList.remove(...Object.values(categoryMap));
        category.classList.add(categoryMap[value as keyof typeof categoryMap] ?? categoryMap['другое']);
    }

    set image(value: string) {
        if (this.imageElement) this.setImage(this.imageElement, value);
    }
}
