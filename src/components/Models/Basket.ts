import type { IProduct } from '../../types';
import type { IEvents } from '../base/Events';
import { EVENTS } from '../../utils/constants';

export class Basket {
    protected items: IProduct[] = [];

    constructor(protected events: IEvents) {}

    getItems(): IProduct[] {
        return this.items;
    }

    addItem(product: IProduct): void {
        this.items.push(product);
        this.events.emit(EVENTS.basketChanged);
    }

    removeItem(product: IProduct): void {
        this.items = this.items.filter((item) => item.id !== product.id);
        this.events.emit(EVENTS.basketChanged);
    }

    clear(): void {
        this.items = [];
        this.events.emit(EVENTS.basketChanged);
    }

    getTotal(): number {
        return this.items.reduce((total, item) => total + (item.price ?? 0), 0);
    }

    getCount(): number {
        return this.items.length;
    }

    hasItem(id: string): boolean {
        return this.items.some((item) => item.id === id);
    }
}
