import { EVENTS } from '../../utils/constants';
import { Component } from '../base/Component';
import type { IEvents } from '../base/Events';
import type { IModalComponent, IModalView } from '../../types';
import { ensureElement } from '../../utils/utils';

export class Modal extends Component<IModalView> implements IModalComponent {
    protected contentElement: HTMLElement;
    protected closeButton: HTMLButtonElement;
    protected previousFocus: HTMLElement | null = null;

    constructor(container: HTMLElement, protected events: IEvents) {
        super(container);
        this.contentElement = ensureElement('.modal__content', container);
        this.closeButton = ensureElement<HTMLButtonElement>('.modal__close', container);
        this.closeButton.addEventListener('click', () => this.close());
        container.addEventListener('click', (event) => {
            if (event.target === container) this.close();
        });
        container.addEventListener('keydown', (event) => {
            if (event.key === 'Escape') {
                event.preventDefault();
                this.close();
            }
            if (event.key !== 'Tab') return;
            const controls = Array.from(container.querySelectorAll<HTMLElement>(
                'button:not(:disabled), input:not(:disabled), a[href], [tabindex="0"]',
            ));
            const first = controls[0];
            const last = controls[controls.length - 1];
            if (!first) {
                event.preventDefault();
                container.focus();
            } else if (event.shiftKey && (document.activeElement === first || document.activeElement === container)) {
                event.preventDefault();
                last.focus();
            } else if (!event.shiftKey && document.activeElement === last) {
                event.preventDefault();
                first.focus();
            }
        });
    }

    set content(element: HTMLElement) {
        this.contentElement.replaceChildren(element);
    }

    open(content: HTMLElement, label: string): void {
        if (!this.container.classList.contains('modal_active')) {
            this.previousFocus = document.activeElement instanceof HTMLElement ? document.activeElement : null;
        }
        this.content = content;
        this.container.setAttribute('aria-label', label);
        this.container.setAttribute('aria-hidden', 'false');
        this.container.classList.add('modal_active');
        this.events.emit(EVENTS.modalOpen);
        this.closeButton.focus();
    }

    set pending(value: boolean) {
        this.container.setAttribute('aria-busy', String(value));
        if (value) this.closeButton.focus();
    }

    close(): void {
        this.container.classList.remove('modal_active');
        this.container.setAttribute('aria-hidden', 'true');
        this.events.emit(EVENTS.modalClose);
        this.previousFocus?.focus();
        this.contentElement.replaceChildren();
    }
}
