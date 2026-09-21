import type { IEvents } from '../base/Events';
import type { ICardFactory, IProduct } from '../../types';
import { CatalogCard } from './CatalogCard';
import { BasketCard } from './BasketCard';
import { cloneTemplate } from '../../utils/utils';

export class CardFactory implements ICardFactory {
    constructor(
        protected events: IEvents,
        protected catalogTemplate: HTMLTemplateElement,
        protected basketTemplate: HTMLTemplateElement,
    ) {}

    createCatalogCard(product: IProduct): HTMLElement {
        const { id, title, price, category, image } = product;
        return new CatalogCard(cloneTemplate(this.catalogTemplate), this.events)
            .render({ id, title, price, category, image });
    }

    createBasketCard(product: IProduct, index: number): HTMLElement {
        const { id, title, price } = product;
        return new BasketCard(cloneTemplate(this.basketTemplate), this.events)
            .render({ id, title, price, index });
    }
}
