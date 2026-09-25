import { Card } from './Card';
import type { IEvents } from '../base/Events';
import type { IPreviewView } from '../../types';
import { EVENTS } from '../../utils/constants';
import { ensureElement } from '../../utils/utils';

export class PreviewCard extends Card<IPreviewView> {
    protected descriptionElement: HTMLElement;
    protected button: HTMLButtonElement;

    constructor(container: HTMLElement, events: IEvents) {
        super(container);
        this.descriptionElement = ensureElement('.card__text', container);
        this.button = ensureElement<HTMLButtonElement>('.card__button', container);
        this.button.addEventListener('click', () => events.emit(EVENTS.productToggle));
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
