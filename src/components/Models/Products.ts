import type { IProduct, IProductsModel } from '../../types';

export class Products implements IProductsModel {
    protected items: IProduct[] = [];
    protected selectedProduct: IProduct | null = null;

    setItems(items: IProduct[]): void {
        this.items = [...items];
    }

    getItems(): IProduct[] {
        return [...this.items];
    }

    getItem(id: string): IProduct | undefined {
        return this.items.find((item) => item.id === id);
    }

    setSelectedProduct(product: IProduct | null): void {
        this.selectedProduct = product;
    }

    getSelectedProduct(): IProduct | null {
        return this.selectedProduct;
    }
}
