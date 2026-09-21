import { EVENTS } from '../../utils/constants';
import { Card } from './Card';
import type { IEvents } from '../base/Events';

export class CatalogCard extends Card {
    constructor(container: HTMLElement, events: IEvents) {
        super(container);
        container.addEventListener('click', () => events.emit(EVENTS.productSelect, { id: this.productId }));
    }
}
