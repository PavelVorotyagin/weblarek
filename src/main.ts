import './scss/styles.scss';

import { Api } from './components/base/Api';
import { Products } from './components/Models/Products';
import { Basket } from './components/Models/Basket';
import { Buyer } from './components/Models/Buyer';
import { WebLarekApi } from './components/WebLarekApi';
import { API_URL } from './utils/constants';
import { apiProducts } from './utils/data';

const productsModel = new Products();
const basketModel = new Basket();
const buyerModel = new Buyer();
const api = new Api(API_URL);
const webLarekApi = new WebLarekApi(api);

const firstProduct = apiProducts.items[0];
const secondProduct = apiProducts.items[1];

productsModel.setItems(apiProducts.items);
console.log('Каталог после сохранения тестовых товаров:', productsModel.getItems());
console.log('Товар по идентификатору:', productsModel.getItem(firstProduct.id));

productsModel.setSelectedProduct(firstProduct);
console.log('Товар для подробного просмотра:', productsModel.getSelectedProduct());

basketModel.addItem(firstProduct);
basketModel.addItem(secondProduct);
console.log('Товары после добавления:', basketModel.getItems());
console.log('Количество товаров:', basketModel.getCount());
console.log('Общая стоимость:', basketModel.getTotal());
console.log('Наличие первого товара:', basketModel.hasItem(firstProduct.id));

basketModel.removeItem(firstProduct);
console.log('Товары после удаления:', basketModel.getItems());

basketModel.clear();
console.log('Товары после очистки:', basketModel.getItems());

console.log('Начальные данные покупателя:', buyerModel.getData());
console.log('Ошибки пустых полей:', buyerModel.validate());

buyerModel.setData({ payment: 'card', address: 'Тестовый адрес, дом 1' });
console.log('Данные после выбора оплаты и ввода адреса:', buyerModel.getData());
console.log('Ошибки после первого шага:', buyerModel.validate());

buyerModel.setData({ email: 'buyer@example.com' });
buyerModel.setData({ phone: '+7 (000) 000-00-00' });
console.log('Данные после добавления контактов:', buyerModel.getData());
console.log('Ошибки заполненных данных:', buyerModel.validate());

buyerModel.clear();
console.log('Данные после очистки:', buyerModel.getData());

webLarekApi.getProducts()
    .then((response) => {
        productsModel.setItems(response.items);
        console.log('Сохранённые в модели товары с сервера:', productsModel.getItems());
    })
    .catch((error: unknown) => {
        console.error('Не удалось загрузить каталог с сервера:', error);
    });
