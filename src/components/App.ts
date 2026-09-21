import { EVENTS } from '../utils/constants';
import type { IEvents } from './base/Events';
import type {
    IAppViews, IBasketModel, IBuyer, IBuyerModel, ICardFactory,
    IOrder, IProductEvent, IProductsModel, IWebLarekApi,
} from '../types';

export class App {
    protected submitting = false;
    protected loading = false;

    constructor(
        events: IEvents,
        protected products: IProductsModel,
        protected basket: IBasketModel,
        protected buyer: IBuyerModel,
        protected api: IWebLarekApi,
        protected views: IAppViews,
        protected cards: ICardFactory,
    ) {
        events.on(EVENTS.catalogLoad, () => { void this.loadCatalog(); });
        events.on<IProductEvent>(EVENTS.productSelect, ({ id }) => this.showProduct(id));
        events.on<IProductEvent>(EVENTS.productToggle, ({ id }) => this.toggleProduct(id));
        events.on(EVENTS.basketOpen, () => this.showBasket());
        events.on<IProductEvent>(EVENTS.basketRemove, ({ id }) => this.removeProduct(id));
        events.on(EVENTS.orderOpen, () => this.showOrder());
        events.on<Partial<IBuyer>>(EVENTS.buyerChange, (data) => {
            if (this.submitting) return;
            this.buyer.setData(data);
            this.updateForms();
        });
        events.on(EVENTS.orderNext, () => this.showContacts());
        events.on(EVENTS.orderSubmit, () => { void this.submitOrder(); });
        events.on(EVENTS.successClose, () => this.views.modal.close());
        events.on(EVENTS.modalOpen, () => { this.views.page.locked = true; });
        events.on(EVENTS.modalClose, () => {
            this.views.page.locked = false;
            this.products.setSelectedProduct(null);
        });
    }

    async start(): Promise<void> {
        this.updateBasket();
        this.updateForms();
        await this.loadCatalog();
    }

    protected async loadCatalog(): Promise<void> {
        if (this.loading) return;
        this.loading = true;
        this.views.page.showMessage('Загружаем товары…');
        try {
            const response = await this.api.getProducts();
            this.products.setItems(response.items);
            this.views.page.catalog = this.products.getItems().map((product) =>
                this.cards.createCatalogCard(product),
            );
        } catch {
            this.views.page.showMessage('Не удалось загрузить товары. Проверьте соединение и попробуйте снова.', true);
        } finally {
            this.loading = false;
        }
    }

    protected showProduct(id: string): void {
        if (this.submitting) return;
        const product = this.products.getItem(id);
        if (!product) return;
        this.products.setSelectedProduct(product);
        this.views.modal.open(this.views.preview.render({
            ...product,
            inBasket: this.basket.hasItem(id),
        }), product.title);
    }

    protected toggleProduct(id: string): void {
        if (this.submitting) return;
        const product = this.products.getSelectedProduct();
        if (!product || product.id !== id || product.price === null) return;
        if (this.basket.hasItem(id)) this.basket.removeItem(product);
        else this.basket.addItem(product);
        this.updateBasket();
        this.views.modal.close();
    }

    protected updateBasket(): void {
        this.views.page.count = this.basket.getCount();
        this.views.basket.render({
            items: this.basket.getItems().map((product, index) =>
                this.cards.createBasketCard(product, index + 1),
            ),
            total: this.basket.getTotal(),
        });
    }

    protected showBasket(): void {
        if (this.submitting) return;
        this.updateBasket();
        this.views.modal.open(this.views.basket.render(), 'Корзина');
    }

    protected removeProduct(id: string): void {
        if (this.submitting) return;
        const items = this.basket.getItems();
        const index = items.findIndex((item) => item.id === id);
        if (index === -1) return;
        this.basket.removeItem(items[index]);
        this.updateBasket();
        this.views.basket.focusAfterRemoval(index);
    }

    protected updateForms(): void {
        const data = this.buyer.getData();
        const errors = this.buyer.validate();
        this.views.order.render({
            payment: data.payment,
            address: data.address,
            errors: { payment: errors.payment, address: errors.address },
            valid: !errors.payment && !errors.address,
        });
        this.views.contacts.render({
            email: data.email,
            phone: data.phone,
            errors: { email: errors.email, phone: errors.phone },
            valid: !errors.email && !errors.phone,
        });
    }

    protected showOrder(): void {
        if (this.submitting || !this.basket.getCount()) return;
        this.updateForms();
        this.views.modal.open(this.views.order.render(), 'Оформление заказа: оплата и доставка');
    }

    protected showContacts(): void {
        if (this.submitting || !this.basket.getCount()) return;
        this.updateForms();
        const errors = this.buyer.validate();
        if (errors.payment || errors.address) return;
        this.views.modal.open(this.views.contacts.render(), 'Оформление заказа: контакты');
    }

    protected async submitOrder(): Promise<void> {
        if (this.submitting || !this.basket.getCount()) return;
        this.updateForms();
        const data = this.buyer.getData();
        if (Object.keys(this.buyer.validate()).length || data.payment === '') return;
        const order: IOrder = {
            payment: data.payment,
            address: data.address.trim(),
            email: data.email.trim(),
            phone: data.phone.trim(),
            total: this.basket.getTotal(),
            items: this.basket.getItems().map((product) => product.id),
        };
        this.submitting = true;
        this.views.contacts.pending = true;
        this.views.modal.pending = true;
        try {
            const response = await this.api.orderProducts(order);
            this.basket.clear();
            this.buyer.clear();
            this.updateBasket();
            this.updateForms();
            this.views.modal.pending = false;
            this.views.modal.open(this.views.success.render({ total: response.total }), 'Заказ оформлен');
        } catch (error: unknown) {
            this.views.contacts.serverError = typeof error === 'string'
                ? error : 'Не удалось оформить заказ. Попробуйте ещё раз.';
        } finally {
            this.submitting = false;
            this.views.contacts.pending = false;
            this.views.modal.pending = false;
        }
    }
}
