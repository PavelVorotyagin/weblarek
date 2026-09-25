import { Card } from './Card';
import type { TCardView } from '../../types';
import { categoryMap } from '../../utils/constants';
import { ensureElement } from '../../utils/utils';

export class CatalogCard extends Card<TCardView> {
    protected categoryElement: HTMLElement;
    protected imageElement: HTMLImageElement;

    constructor(container: HTMLElement, onClick: () => void) {
        super(container);
        this.categoryElement = ensureElement('.card__category', container);
        this.imageElement = ensureElement<HTMLImageElement>('.card__image', container);
        container.addEventListener('click', onClick);
    }

    set title(value: string) {
        super.title = value;
        this.imageElement.alt = value;
    }

    set category(value: string) {
        this.categoryElement.textContent = value;
        this.categoryElement.classList.remove(...Object.values(categoryMap));
        this.categoryElement.classList.add(categoryMap[value as keyof typeof categoryMap] ?? categoryMap['другое']);
    }

    set image(value: string) {
        this.setImage(this.imageElement, value);
    }
}
