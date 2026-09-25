import { Component } from '../base/Component';
import type { IEvents } from '../base/Events';
import type { IFormState } from '../../types';
import { ensureElement } from '../../utils/utils';

export abstract class Form<T extends IFormState> extends Component<T> {
    protected submitButton: HTMLButtonElement;
    protected errorsElement: HTMLElement;

    constructor(container: HTMLFormElement, protected events: IEvents, submitEvent: string) {
        super(container);
        this.submitButton = ensureElement<HTMLButtonElement>('[type="submit"]', container);
        this.errorsElement = ensureElement('.form__errors', container);
        container.addEventListener('submit', (event) => {
            event.preventDefault();
            this.events.emit(submitEvent);
        });
    }

    set valid(value: boolean) {
        this.submitButton.disabled = !value;
    }

    set errors(value: string) {
        this.errorsElement.textContent = value;
    }
}
