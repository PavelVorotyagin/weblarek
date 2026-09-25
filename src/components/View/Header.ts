import { Component } from '../base/Component';
import type { IEvents } from '../base/Events';
import type { IHeaderView } from '../../types';
import { EVENTS } from '../../utils/constants';
import { ensureElement } from '../../utils/utils';

export class Header extends Component<IHeaderView> {
    protected basketButton: HTMLButtonElement;
    protected counter: HTMLElement;

    constructor(container: HTMLElement, events: IEvents) {
        super(container);
        this.basketButton = ensureElement<HTMLButtonElement>('.header__basket', container);
        this.counter = ensureElement('.header__basket-counter', container);
        this.basketButton.addEventListener('click', () => events.emit(EVENTS.basketOpen));
    }

    set count(value: number) {
        this.counter.textContent = String(value);
    }
}
