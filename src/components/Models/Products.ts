import type { IProduct } from '../../types';
import type { IEvents } from '../base/Events';
import { EVENTS } from '../../utils/constants';

export class Products {
    protected items: IProduct[] = [];
    protected selectedProduct: IProduct | null = null;

    constructor(protected events: IEvents) {}

    setItems(items: IProduct[]): void {
        this.items = items;
        this.events.emit(EVENTS.productsChanged);
    }

    getItems(): IProduct[] {
        return this.items;
    }

    getItem(id: string): IProduct | undefined {
        return this.items.find((item) => item.id === id);
    }

    setSelectedProduct(product: IProduct): void {
        this.selectedProduct = product;
        this.events.emit(EVENTS.productChanged);
    }

    getSelectedProduct(): IProduct | null {
        return this.selectedProduct;
    }
}
