import './scss/styles.scss';

import { Api } from './components/base/Api';
import { Products } from './components/Models/Products';
import { Basket } from './components/Models/Basket';
import { Buyer } from './components/Models/Buyer';
import { WebLarekApi } from './components/WebLarekApi';
import { API_URL } from './utils/constants';
import { apiProducts } from './utils/data';

import { EventEmitter } from './components/base/Events';
import { App } from './components/App';
import { Page } from './components/View/Page';
import { Modal } from './components/View/Modal';
import { PreviewCard } from './components/View/PreviewCard';
import { BasketView } from './components/View/BasketView';
import { OrderForm } from './components/View/OrderForm';
import { ContactsForm } from './components/View/ContactsForm';
import { Success } from './components/View/Success';
import { CardFactory } from './components/View/CardFactory';
import { cloneTemplate, ensureElement } from './utils/utils';

// Проверки первой части запускаются отдельно от рабочего состояния магазина.
if (import.meta.env.DEV) {
    const productsModel = new Products();
    const basketModel = new Basket();
    const buyerModel = new Buyer();
    const api = new Api(API_URL);
    const webLarekApi = new WebLarekApi(api);

    const [firstProduct, secondProduct, unavailableProduct] = apiProducts.items;

    console.group('Каталог: проверка модели Products');
    console.log('Начальный каталог:', productsModel.getItems());
    console.log('Начальный выбранный товар:', productsModel.getSelectedProduct());

    productsModel.setItems(apiProducts.items);
    console.log('Каталог после сохранения тестовых товаров:', productsModel.getItems());
    console.log('Товар по существующему id:', productsModel.getItem(firstProduct.id));
    console.log('Товар по отсутствующему id:', productsModel.getItem('missing-product'));
    console.assert(
        productsModel.getItems().length === apiProducts.items.length,
        'Каталог должен содержать все переданные товары',
    );

    productsModel.setSelectedProduct(firstProduct);
    console.log('Товар для подробного просмотра:', productsModel.getSelectedProduct());
    productsModel.setSelectedProduct(null);
    console.log('Выбранный товар после сброса:', productsModel.getSelectedProduct());
    console.groupEnd();

    console.group('Корзина: проверка модели Basket');
    console.log('Начальные товары:', basketModel.getItems());
    console.log('Начальные количество и сумма:', basketModel.getCount(), basketModel.getTotal());
    console.log('Наличие товара до добавления:', basketModel.hasItem(firstProduct.id));

    basketModel.addItem(firstProduct);
    basketModel.addItem(secondProduct);
    console.log('Товары после добавления:', basketModel.getItems());
    console.log('Количество товаров (ожидается 2):', basketModel.getCount());
    console.log('Общая стоимость (ожидается 2200):', basketModel.getTotal());
    console.log('Наличие добавленного товара:', basketModel.hasItem(firstProduct.id));
    console.assert(
        basketModel.getCount() === 2 && basketModel.getTotal() === 2200,
        'В корзине должны быть два товара стоимостью 2200 синапсов',
    );

    basketModel.addItem({ ...firstProduct });
    console.log('Количество после повторного добавления (ожидается 2):', basketModel.getCount());
    console.assert(basketModel.getCount() === 2, 'Корзина не должна содержать дубликаты');

    basketModel.addItem(unavailableProduct);
    console.log('Наличие товара без цены (ожидается false):', basketModel.hasItem(unavailableProduct.id));
    console.assert(!basketModel.hasItem(unavailableProduct.id), 'Товар без цены недоступен для покупки');

    basketModel.removeItem({ ...firstProduct });
    console.log('Товары после удаления по id:', basketModel.getItems());
    console.log('Наличие удалённого товара:', basketModel.hasItem(firstProduct.id));
    console.log('Количество и сумма после удаления:', basketModel.getCount(), basketModel.getTotal());
    console.assert(
        !basketModel.hasItem(firstProduct.id) && basketModel.getTotal() === 1450,
        'Удаление должно работать по id товара и пересчитывать сумму',
    );

    basketModel.clear();
    console.log('Товары после очистки:', basketModel.getItems());
    console.log('Количество и сумма после очистки:', basketModel.getCount(), basketModel.getTotal());
    console.assert(
        basketModel.getCount() === 0 && basketModel.getTotal() === 0,
        'После очистки корзина должна быть пустой',
    );
    console.groupEnd();

    console.group('Покупатель: проверка модели Buyer');
    console.log('Начальные данные:', buyerModel.getData());
    console.log('Ошибки пустых полей:', buyerModel.validate());

    buyerModel.setData({ payment: 'card', address: 'Тестовый адрес, дом 1' });
    console.log('Данные после первого шага:', buyerModel.getData());
    console.log('Ошибки после первого шага (только email и phone):', buyerModel.validate());

    buyerModel.setData({ email: 'buyer@example.com' });
    console.log('Данные после добавления почты:', buyerModel.getData());
    console.log('Ошибки после добавления почты (только phone):', buyerModel.validate());

    buyerModel.setData({ phone: '+7 (000) 000-00-00' });
    console.log('Данные после добавления телефона:', buyerModel.getData());
    console.log('Ошибки полностью заполненных данных (ожидается {}):', buyerModel.validate());
    console.assert(
        buyerModel.getData().payment === 'card'
            && buyerModel.getData().address === 'Тестовый адрес, дом 1'
            && buyerModel.getData().email === 'buyer@example.com'
            && Object.keys(buyerModel.validate()).length === 0,
        'Частичное обновление должно сохранять остальные данные покупателя',
    );

    buyerModel.setData({ payment: 'cash' });
    console.log('Данные после выбора наличных:', buyerModel.getData());
    console.log('Ошибки при оплате наличными (ожидается {}):', buyerModel.validate());

    buyerModel.setData({ address: '   ' });
    console.log('Ошибки пробельного адреса:', buyerModel.validate());
    console.assert(Boolean(buyerModel.validate().address), 'Адрес из пробелов должен вызывать ошибку');

    buyerModel.clear();
    console.log('Данные после очистки:', buyerModel.getData());
    console.log('Ошибки после очистки (все четыре поля):', buyerModel.validate());
    console.assert(
        Object.values(buyerModel.getData()).every((value) => value === '')
            && Object.keys(buyerModel.validate()).length === 4,
        'Очистка должна сбрасывать все данные покупателя',
    );
    console.groupEnd();

    webLarekApi.getProducts()
        .then((response) => {
            productsModel.setItems(response.items);
            console.group('Каталог с сервера');
            console.log('Сохранённые в модели товары:', productsModel.getItems());
            console.log('Количество сохранённых товаров:', productsModel.getItems().length);
            console.groupEnd();
        })
        .catch((error: unknown) => {
            console.error('Не удалось загрузить каталог с сервера:', error);
        });
}

const events = new EventEmitter();
const products = new Products();
const basket = new Basket();
const buyer = new Buyer();
const apiClient = new WebLarekApi(new Api(API_URL));
const app = new App(events, products, basket, buyer, apiClient, {
    page: new Page(ensureElement('.page__wrapper'), events),
    modal: new Modal(ensureElement('#modal-container'), events),
    preview: new PreviewCard(cloneTemplate('#card-preview'), events),
    basket: new BasketView(cloneTemplate('#basket'), events),
    order: new OrderForm(cloneTemplate<HTMLFormElement>('#order'), events),
    contacts: new ContactsForm(cloneTemplate<HTMLFormElement>('#contacts'), events),
    success: new Success(cloneTemplate('#success'), events),
}, new CardFactory(
    events,
    ensureElement<HTMLTemplateElement>('#card-catalog'),
    ensureElement<HTMLTemplateElement>('#card-basket'),
));

void app.start();
