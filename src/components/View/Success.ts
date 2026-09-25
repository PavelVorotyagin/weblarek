import { Component } from '../base/Component';
import type { IEvents } from '../base/Events';
import type { ISuccessView } from '../../types';
import { EVENTS } from '../../utils/constants';
import { ensureElement } from '../../utils/utils';

export class Success extends Component<ISuccessView> {
    protected descriptionElement: HTMLElement;
    protected button: HTMLButtonElement;

    constructor(container: HTMLElement, protected events: IEvents) {
        super(container);
        this.descriptionElement = ensureElement('.order-success__description', container);
        this.button = ensureElement<HTMLButtonElement>('.order-success__close', container);
        this.button.addEventListener('click', () => this.events.emit(EVENTS.successClose));
    }

    set total(value: number) {
        this.descriptionElement.textContent = `Списано ${value} синапсов`;
    }
}
