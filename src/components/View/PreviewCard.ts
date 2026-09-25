import { Card } from './Card';
import type { IEvents } from '../base/Events';
import type { IPreviewView } from '../../types';
import { categoryMap, EVENTS } from '../../utils/constants';
import { ensureElement } from '../../utils/utils';

export class PreviewCard extends Card<IPreviewView> {
    protected categoryElement: HTMLElement;
    protected imageElement: HTMLImageElement;
    protected descriptionElement: HTMLElement;
    protected button: HTMLButtonElement;

    constructor(container: HTMLElement, protected events: IEvents) {
        super(container);
        this.categoryElement = ensureElement('.card__category', container);
        this.imageElement = ensureElement<HTMLImageElement>('.card__image', container);
        this.descriptionElement = ensureElement('.card__text', container);
        this.button = ensureElement<HTMLButtonElement>('.card__button', container);
        this.button.addEventListener('click', () => this.events.emit(EVENTS.productToggle));
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

    set description(value: string) {
        this.descriptionElement.textContent = value;
    }

    set buttonText(value: string) {
        this.button.textContent = value;
    }

    set disabled(value: boolean) {
        this.button.disabled = value;
    }
}
