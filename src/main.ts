import './scss/styles.scss';

import { Api } from './components/base/Api';
import { EventEmitter } from './components/base/Events';
import { Products } from './components/Models/Products';
import { Basket } from './components/Models/Basket';
import { Buyer } from './components/Models/Buyer';
import { WebLarekApi } from './components/WebLarekApi';
import { Catalog } from './components/View/Catalog';
import { Header } from './components/View/Header';
import { CatalogCard } from './components/View/CatalogCard';
import { PreviewCard } from './components/View/PreviewCard';
import { BasketCard } from './components/View/BasketCard';
import { BasketView } from './components/View/BasketView';
import { Modal } from './components/View/Modal';
import { OrderForm } from './components/View/OrderForm';
import { ContactsForm } from './components/View/ContactsForm';
import { Success } from './components/View/Success';
import type { IBuyer, IContactsFormView, IOrder, IOrderFormView, IProductEvent } from './types';
import { API_URL, CDN_URL, EVENTS } from './utils/constants';
import { cloneTemplate, ensureElement } from './utils/utils';

const events = new EventEmitter();
const productsModel = new Products(events);
const basketModel = new Basket(events);
const buyerModel = new Buyer(events);
const webLarekApi = new WebLarekApi(new Api(API_URL));

const catalogTemplate = ensureElement<HTMLTemplateElement>('#card-catalog');
const basketCardTemplate = ensureElement<HTMLTemplateElement>('#card-basket');
const catalog = new Catalog(ensureElement('.gallery'));
const header = new Header(ensureElement('.header'), events);
const modal = new Modal(ensureElement('#modal-container'), events);
const preview = new PreviewCard(cloneTemplate('#card-preview'), events);
const basket = new BasketView(cloneTemplate('#basket'), events);
const orderForm = new OrderForm(cloneTemplate<HTMLFormElement>('#order'), events);
const contactsForm = new ContactsForm(cloneTemplate<HTMLFormElement>('#contacts'), events);
const success = new Success(cloneTemplate('#success'), events);

let isSubmitting = false;

function getOrderState(): IOrderFormView {
    const data = buyerModel.getData();
    const errors = buyerModel.validate();
    return {
        payment: data.payment,
        address: data.address,
        valid: !errors.payment && !errors.address && !isSubmitting,
        errors: [errors.payment, errors.address].filter(Boolean).join('. '),
    };
}

function getContactsState(): IContactsFormView {
    const data = buyerModel.getData();
    const errors = buyerModel.validate();
    return {
        email: data.email,
        phone: data.phone,
        valid: !errors.email && !errors.phone && !isSubmitting,
        errors: [errors.email, errors.phone].filter(Boolean).join('. '),
    };
}

function renderBasket(): HTMLElement {
    const items = basketModel.getItems().map((product, index) => {
        const card = new BasketCard(
            cloneTemplate(basketCardTemplate),
            events.trigger<IProductEvent>(EVENTS.basketRemove, { id: product.id }),
        );
        return card.render({ title: product.title, price: product.price, index: index + 1 });
    });
    return basket.render({
        items,
        total: basketModel.getTotal(),
        disabled: basketModel.getCount() === 0 || isSubmitting,
    });
}

function openModal(content: HTMLElement): void {
    modal.render({ content });
    modal.open();
}

events.on(EVENTS.productsChanged, () => {
    const cards = productsModel.getItems().map((product) => {
        const card = new CatalogCard(
            cloneTemplate(catalogTemplate),
            events.trigger<IProductEvent>(EVENTS.productSelect, { id: product.id }),
        );
        return card.render({
            title: product.title,
            price: product.price,
            category: product.category,
            image: CDN_URL + product.image,
        });
    });
    catalog.render({ items: cards });
});

events.on<IProductEvent>(EVENTS.productSelect, ({ id }) => {
    if (isSubmitting) return;
    const product = productsModel.getItem(id);
    if (product) productsModel.setSelectedProduct(product);
});

events.on(EVENTS.productChanged, () => {
    const product = productsModel.getSelectedProduct();
    if (!product) return;
    openModal(preview.render({
        title: product.title,
        price: product.price,
        category: product.category,
        image: CDN_URL + product.image,
        description: product.description,
        disabled: product.price === null,
        buttonText: product.price === null ? 'Недоступно'
            : basketModel.hasItem(product.id) ? 'Удалить из корзины' : 'Купить',
    }));
});

events.on(EVENTS.productToggle, () => {
    if (isSubmitting) return;
    const product = productsModel.getSelectedProduct();
    if (!product || product.price === null) return;
    if (basketModel.hasItem(product.id)) basketModel.removeItem(product);
    else basketModel.addItem(product);
    modal.close();
});

events.on(EVENTS.basketChanged, () => {
    header.render({ count: basketModel.getCount() });
    renderBasket();
});

events.on(EVENTS.basketOpen, () => {
    if (!isSubmitting) openModal(renderBasket());
});

events.on<IProductEvent>(EVENTS.basketRemove, ({ id }) => {
    if (isSubmitting) return;
    const product = basketModel.getItems().find((item) => item.id === id);
    if (product) basketModel.removeItem(product);
});

events.on(EVENTS.orderOpen, () => {
    if (isSubmitting || basketModel.getCount() === 0) return;
    openModal(orderForm.render(getOrderState()));
});

events.on<Partial<IBuyer>>(EVENTS.buyerChange, (data) => {
    if (!isSubmitting) buyerModel.setData(data);
});

events.on(EVENTS.buyerChanged, () => {
    orderForm.render(getOrderState());
    contactsForm.render(getContactsState());
});

events.on(EVENTS.orderNext, () => {
    if (isSubmitting || basketModel.getCount() === 0) return;
    const errors = buyerModel.validate();
    if (errors.payment || errors.address) return;
    openModal(contactsForm.render(getContactsState()));
});

events.on(EVENTS.orderSubmit, () => {
    if (isSubmitting || basketModel.getCount() === 0) return;
    const data = buyerModel.getData();
    const errors = buyerModel.validate();
    if (Object.keys(errors).length || data.payment === '') return;
    const order: IOrder = {
        ...data,
        payment: data.payment,
        items: basketModel.getItems().map((product) => product.id),
        total: basketModel.getTotal(),
    };
    isSubmitting = true;
    webLarekApi.orderProducts(order)
        .then((response) => {
            isSubmitting = false;
            basketModel.clear();
            buyerModel.clear();
            openModal(success.render({ total: response.total }));
        })
        .catch((error: unknown) => {
            isSubmitting = false;
            openModal(contactsForm.render({
                ...getContactsState(),
                errors: typeof error === 'string' ? error : 'Не удалось оформить заказ. Попробуйте ещё раз.',
            }));
        });
});

events.on(EVENTS.modalClose, () => modal.close());
events.on(EVENTS.successClose, () => modal.close());

webLarekApi.getProducts()
    .then((response) => productsModel.setItems(response.items))
    .catch((error: unknown) => {
        console.error('Не удалось загрузить каталог с сервера:', error);
    });
