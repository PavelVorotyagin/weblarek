import { Component } from '../base/Component';
import type { IEvents } from '../base/Events';
import type { IModalView } from '../../types';
import { EVENTS } from '../../utils/constants';
import { ensureElement } from '../../utils/utils';

export class Modal extends Component<IModalView> {
    protected contentElement: HTMLElement;
    protected closeButton: HTMLButtonElement;

    constructor(container: HTMLElement, protected events: IEvents) {
        super(container);
        this.contentElement = ensureElement('.modal__content', container);
        this.closeButton = ensureElement<HTMLButtonElement>('.modal__close', container);
        this.closeButton.addEventListener('click', () => this.events.emit(EVENTS.modalClose));
        container.addEventListener('click', (event) => {
            if (event.target === container) this.events.emit(EVENTS.modalClose);
        });
    }

    set content(value: HTMLElement) {
        this.contentElement.replaceChildren(value);
    }

    open(): void {
        this.container.classList.add('modal_active');
    }

    close(): void {
        this.container.classList.remove('modal_active');
        this.contentElement.replaceChildren();
    }
}
