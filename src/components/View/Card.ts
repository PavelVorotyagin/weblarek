import { Component } from '../base/Component';
import type { ICardView } from '../../types';
import { ensureElement } from '../../utils/utils';
import { CDN_URL, categoryMap } from '../../utils/constants';

export abstract class Card extends Component<ICardView> {
    protected titleElement: HTMLElement;
    protected priceElement: HTMLElement;
    protected productId = '';
    protected categoryElement: HTMLElement | null;
    protected imageElement: HTMLImageElement | null;

    protected constructor(container: HTMLElement) {
        super(container);
        this.titleElement = ensureElement('.card__title', container);
        this.priceElement = ensureElement('.card__price', container);
        this.categoryElement = container.querySelector('.card__category');
        this.imageElement = container.querySelector('.card__image');
    }

    set id(value: string) {
        this.productId = value;
        this.container.dataset.id = value;
    }

    set title(value: string) {
        this.titleElement.textContent = value;
        if (this.imageElement) this.imageElement.alt = value;
    }

    set price(value: number | null) {
        this.priceElement.textContent = value === null ? 'Бесценно' : `${value} синапсов`;
    }

    set category(value: string) {
        if (!this.categoryElement) return;
        this.categoryElement.textContent = value;
        Object.values(categoryMap).forEach((name) => this.categoryElement?.classList.remove(name));
        const modifier = categoryMap[value as keyof typeof categoryMap] ?? categoryMap['другое'];
        this.categoryElement.classList.add(modifier);
    }

    set image(value: string) {
        if (this.imageElement) {
            this.setImage(this.imageElement, `${CDN_URL}/${value.replace(/^\/+/, '')}`);
        }
    }
}
