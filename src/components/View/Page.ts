import { EVENTS } from '../../utils/constants';
import { Component } from '../base/Component';
import type { IEvents } from '../base/Events';
import type { IPageComponent, IPageView } from '../../types';
import { ensureElement } from '../../utils/utils';

export class Page extends Component<IPageView> implements IPageComponent {
    protected gallery: HTMLElement;
    protected counter: HTMLElement;
    protected basketButton: HTMLButtonElement;

    constructor(container: HTMLElement, protected events: IEvents) {
        super(container);
        this.gallery = ensureElement('.gallery', container);
        this.counter = ensureElement('.header__basket-counter', container);
        this.basketButton = ensureElement<HTMLButtonElement>('.header__basket', container);
        this.basketButton.addEventListener('click', () => events.emit(EVENTS.basketOpen));
    }

    set catalog(items: HTMLElement[]) {
        this.gallery.replaceChildren(...items);
        if (!items.length) this.showMessage('Каталог пока пуст');
    }

    set count(value: number) {
        this.counter.textContent = String(value);
        this.basketButton.setAttribute('aria-label', `Корзина, товаров: ${value}`);
    }

    set locked(value: boolean) {
        this.container.inert = value;
    }

    showMessage(message: string, retry = false): void {
        const status = document.createElement('div');
        status.className = 'gallery__status';
        status.setAttribute('role', 'status');
        const text = document.createElement('p');
        text.textContent = message;
        status.append(text);
        if (retry) {
            const button = document.createElement('button');
            button.className = 'button';
            button.textContent = 'Попробовать снова';
            button.addEventListener('click', () => this.events.emit(EVENTS.catalogLoad));
            status.append(button);
        }
        this.gallery.replaceChildren(status);
    }
}
