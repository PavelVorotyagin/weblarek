import { EVENTS } from '../../utils/constants';
import { Component } from '../base/Component';
import type { IEvents } from '../base/Events';
import type { ISuccessView } from '../../types';
import { ensureElement } from '../../utils/utils';

export class Success extends Component<ISuccessView> {
    protected description: HTMLElement;

    constructor(container: HTMLElement, events: IEvents) {
        super(container);
        this.description = ensureElement('.order-success__description', container);
        ensureElement('.order-success__close', container).addEventListener('click', () => events.emit(EVENTS.successClose));
    }

    set total(value: number) {
        this.description.textContent = `Списано ${value} синапсов`;
    }
}
