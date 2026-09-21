import { BUYER_INPUT_FIELDS, EVENTS } from '../../utils/constants';
import { Component } from '../base/Component';
import type { IEvents } from '../base/Events';
import type { IFormComponent, IFormView, TBuyerErrors } from '../../types';
import { ensureElement } from '../../utils/utils';

export abstract class Form<T extends IFormView> extends Component<T> implements IFormComponent<T> {
    protected submitButton: HTMLButtonElement;
    protected errorsElement: HTMLElement;
    protected isValid = false;
    protected isPending = false;
    protected submitText: string;

    constructor(container: HTMLFormElement, events: IEvents, submitEvent: string) {
        super(container);
        container.noValidate = true;
        this.submitButton = ensureElement<HTMLButtonElement>('[type="submit"]', container);
        this.errorsElement = ensureElement('.form__errors', container);
        this.submitText = this.submitButton.textContent ?? '';
        this.errorsElement.setAttribute('aria-live', 'polite');
        container.addEventListener('submit', (event) => {
            event.preventDefault();
            if (this.isValid && !this.isPending) events.emit(submitEvent);
        });
        container.addEventListener('input', (event) => {
            const input = event.target;
            if (!(input instanceof HTMLInputElement) || this.isPending) return;
            if (BUYER_INPUT_FIELDS.some((name) => name === input.name)) {
                events.emit(EVENTS.buyerChange, { [input.name]: input.value });
            }
        });
    }

    set errors(value: TBuyerErrors) {
        this.errorsElement.textContent = Object.values(value).filter(Boolean).join('. ');
        this.container.querySelectorAll<HTMLInputElement>('input').forEach((input) => {
            input.setAttribute('aria-invalid', String(Boolean(value[input.name as keyof TBuyerErrors])));
        });
    }

    set serverError(value: string) {
        this.errorsElement.textContent = value;
    }

    set valid(value: boolean) {
        this.isValid = value;
        this.updateSubmit();
    }

    set pending(value: boolean) {
        this.isPending = value;
        this.container.querySelectorAll<HTMLInputElement | HTMLButtonElement>('input, button').forEach((input) => {
            input.disabled = value;
        });
        this.submitButton.textContent = value ? 'Оформляем заказ…' : this.submitText;
        this.container.setAttribute('aria-busy', String(value));
        this.updateSubmit();
    }

    protected updateSubmit(): void {
        this.submitButton.disabled = !this.isValid || this.isPending;
    }

    protected setInput(name: string, value: string): void {
        const input = ensureElement<HTMLInputElement>(`[name="${name}"]`, this.container);
        if (input.value !== value) input.value = value;
    }
}
