# Веб-ларёк

Учебный интернет-магазин с товарами для веб-разработчиков. На сайте можно посмотреть товары, добавить их в корзину и оформить заказ. В проекте используются TypeScript, HTML, SCSS и Vite. За основу взят стартовый проект Яндекс Практикума.

## Запуск

```bash
npm ci
cp .env.example .env
npm run dev
```

В `.env` задаётся адрес сервера без завершающего слеша:

```dotenv
VITE_API_ORIGIN=https://larek-api.nomoreparties.co
```

- `npm run build` — проверка TypeScript и сборка проекта в папку `dist`.
- `npm run preview` — запуск собранного проекта.
- `.env` не загружается в Git, поэтому его нужно создать локально.

## Структура и архитектура

- `index.html` — страница и HTML-шаблоны компонентов.
- `src/main.ts` — создание объектов классов, запуск приложения и проверки моделей.
- `src/types/index.ts` — типы и интерфейсы проекта.
- `src/components/base/` — базовые `Component`, `Api`, `EventEmitter`.
- `src/components/Models/` — модели каталога, корзины и покупателя.
- `src/components/View/` — классы для работы с элементами страницы.
- `src/components/App.ts` — связь между данными и страницей.
- `src/components/WebLarekApi.ts` — получение товаров и отправка заказа.
- `src/utils/` — вспомогательные функции, константы и тестовые товары.
- `src/scss/`, `src/common.blocks/` — стили.

В проекте используется **MVP**. Код разделён на три части:

- **Model** — хранит данные и проверяет их. Это каталог, корзина и покупатель.
- **View** — показывает данные на странице и сообщает о действиях пользователя.
- **Presenter** — связывает первые две части. В проекте это класс `App`.

Например, пользователь нажимает на товар. Карточка отправляет событие, `App` находит товар в модели и передаёт его в окно просмотра. Сами модели не работают с HTML и не делают запросы на сервер.

Нужные объекты создаются в `main.ts` и передаются в конструкторы. Интерфейсы описывают, какие методы у этих объектов должны быть. Класс `CardFactory` создаёт карточки. `Component`, `Card` и `Form` — общие классы, от которых наследуются остальные компоненты. Они объявлены абстрактными, поэтому напрямую их объекты не создаются.

## Данные

Основные типы объявлены в `src/types/index.ts`:

```ts
interface IProduct {
    id: string;
    description: string;
    image: string;
    title: string;
    category: string;
    price: number | null;
}

type TPayment = 'card' | 'cash' | '';

interface IBuyer {
    payment: TPayment;
    email: string;
    phone: string;
    address: string;
}

type TBuyerErrors = Partial<Record<keyof IBuyer, string>>;

interface IProductsResponse {
    total: number;
    items: IProduct[];
}

interface IOrder extends IBuyer {
    payment: Exclude<TPayment, ''>;
    total: number;
    items: IProduct['id'][];
}

interface IOrderResponse {
    id: string;
    total: number;
}
```

- `IProduct` — данные товара. Если цена равна `null`, купить товар нельзя. Цена `0` считается допустимой.
- `TPayment` — способ оплаты: `card` — карта, `cash` — наличные, пустая строка — способ ещё не выбран.
- `IBuyer` — данные покупателя: оплата, почта, телефон и адрес.
- `TBuyerErrors` — ошибки заполнения полей. Если поле заполнено правильно, его нет в объекте ошибок.
- `IProductsResponse` — ответ сервера со списком товаров и их количеством.
- `IOrder` — данные заказа: покупатель, общая стоимость и список идентификаторов товаров.
- `IOrderResponse` — ответ сервера с идентификатором заказа и итоговой суммой.

Типы для элементов страницы:

- `IPageView` — карточки `catalog: HTMLElement[]` и счётчик корзины `count: number`.
- `ICardView` — данные товара `IProduct`, признак наличия в корзине `inBasket: boolean` и номер строки `index: number`.
- `IBasketView` — строки корзины `items: HTMLElement[]` и стоимость `total: number`.
- `IFormView` — ошибки полей `errors: TBuyerErrors`, правильность заполнения `valid: boolean`, ожидание ответа `pending: boolean` и ошибка сервера `serverError: string`.
- `IOrderFormView` — состояние формы `IFormView`, оплата и адрес из `IBuyer`.
- `IContactsFormView` — состояние формы `IFormView`, почта и телефон из `IBuyer`.
- `IModalView` — содержимое окна `content: HTMLElement`.
- `ISuccessView` — сумма оформленного заказа `total: number`.
- `IProductEvent` — идентификатор товара `id: IProduct['id']`, который передаётся вместе с событием.

Интерфейсы классов:

- `IProductsModel`, `IBasketModel`, `IBuyerModel` — методы моделей каталога, корзины и покупателя.
- `IWebLarekApi` — методы получения товаров и отправки заказа.
- `ICardFactory` — методы создания карточек каталога и корзины.
- `IView<T>` — общий метод `render(data?: Partial<T>): HTMLElement`, который возвращает HTML-элемент.
- `IPageComponent`, `IModalComponent`, `IBasketComponent`, `IFormComponent<T>` — методы и свойства страницы, окна, корзины и форм.
- `IAppViews` — список компонентов, с которыми работает `App`: `page`, `modal`, `preview`, `basket`, `order`, `contacts`, `success`.

## Базовые классы

### Component<T>

Общий класс для элементов страницы. Реализует интерфейс `IView<T>`. Конструктор `(container: HTMLElement)` принимает основной HTML-элемент и сохраняет его в поле `protected readonly container: HTMLElement`.

- `render(data?: Partial<T>): HTMLElement` — обновляет свойства компонента и возвращает его HTML-элемент.
- `protected setImage(element: HTMLImageElement, src: string, alt?: string): void` — задаёт изображение и альтернативный текст.

### Api

Отправляет запросы на сервер. Реализует `IApi`. Конструктор `(baseUrl: string, options: RequestInit = {})` принимает адрес сервера и настройки запроса.

- `readonly baseUrl: string` — адрес сервера.
- `protected options: RequestInit` — настройки заголовков.
- `ApiPostMethods = 'POST' | 'PUT' | 'DELETE'` — тип доступных способов отправки, объявлен в общем файле типов.

- `get<T extends object>(uri: string): Promise<T>` — GET-запрос.
- `post<T extends object>(uri: string, data: object, method: ApiPostMethods = 'POST'): Promise<T>` — отправка JSON.
- `protected handleResponse<T>(response: Response): Promise<T>` — проверяет ответ сервера. Если запрос не выполнен, передаёт ошибку в обработчик `catch`.

### EventEmitter

Помогает классам обмениваться событиями. Реализует `IEvents`. Конструктор не принимает параметров. В поле `_events: Map<EventName, Set<Subscriber>>` хранятся названия событий и функции, которые нужно вызвать.

В базовом модуле объявлены типы `EventName = string | RegExp` — имя события, `Subscriber = Function` — функция-обработчик и `EmitterEvent = { eventName: string; data: unknown }` — событие с данными.

- `on<T extends object>(eventName: EventName, callback: (event: T) => void): void` — подписка.
- `off(eventName: EventName, callback: Subscriber): void` — удаление подписки.
- `emit<T extends object>(eventName: string, data?: T): void` — отправка события и вызов подписанных функций.
- `onAll(callback: (event: EmitterEvent) => void): void` — подписка на все события.
- `offAll(): void` — очистка подписок.
- `trigger<T extends object>(eventName: string, context?: Partial<T>): (event?: object) => void` — возвращает функцию, которая отправляет событие с заранее заданными данными.

Через интерфейс `IEvents` доступны методы `on`, `emit` и `trigger`. У `trigger` в интерфейсе возвращаемая функция описана как `(data: T) => void`.

## Модели данных

Конструкторы моделей не принимают параметров. Поля объявлены с `protected`, поэтому работать с ними снаружи нужно через методы. Модели занимаются только данными.

### Products

Хранит каталог и товар, который пользователь открыл для просмотра.

- `items: IProduct[] = []` — список товаров.
- `selectedProduct: IProduct | null = null` — выбранный товар. Значение `null` означает, что товар не выбран.

- `setItems(items: IProduct[]): void` — сохраняет копию массива.
- `getItems(): IProduct[]` — возвращает копию массива.
- `getItem(id: string): IProduct | undefined` — находит товар по идентификатору.
- `setSelectedProduct(product: IProduct | null): void` — выбирает товар или сбрасывает выбор.
- `getSelectedProduct(): IProduct | null` — возвращает выбор.

### Basket

Хранит покупки в `items: IProduct[] = []`.

- `getItems(): IProduct[]` — возвращает копию массива корзины.
- `addItem(product: IProduct): void` — добавляет товар с ценой, если товара с таким `id` ещё нет в корзине.
- `removeItem(product: IProduct): void` — удаляет товар по `id`.
- `clear(): void` — очищает корзину.
- `getTotal(): number` — возвращает сумму, для пустой корзины — `0`.
- `getCount(): number` — возвращает количество товаров.
- `hasItem(id: string): boolean` — проверяет наличие товара.

Методы возвращают копии массивов. Сами объекты товаров остаются общими для каталога и корзины.

### Buyer

Хранит данные покупателя. Все поля сначала содержат пустые строки:

- `payment: TPayment` — способ оплаты.
- `email: string` — почта.
- `phone: string` — телефон.
- `address: string` — адрес доставки.

- `setData(data: Partial<IBuyer>): void` — обновляет только переданные поля. Например, можно изменить телефон и сохранить прежний адрес. Поля со значением `undefined` пропускаются.
- `getData(): IBuyer` — возвращает новый объект данных.
- `clear(): void` — очищает все поля.
- `validate(): TBuyerErrors` — проверяет оплату и непустые строки после `trim()`, возвращает ошибки каждого поля. Формат почты и телефона не проверяется, согласно ТЗ.

## Слой коммуникации

### WebLarekApi

Получает товары и отправляет заказ. Конструктор `(api: IApi)` принимает объект `Api` и сохраняет его в поле `protected api: IApi`. Для запросов вызывает методы этого объекта — так используется композиция. Класс реализует интерфейс `IWebLarekApi`.

- `getProducts(): Promise<IProductsResponse>` — GET `/product/`, возвращает весь объект каталога.
- `orderProducts(order: IOrder): Promise<IOrderResponse>` — POST `/order/`, возвращает подтверждение заказа.

Форматы сверены с [коллекцией Postman](https://larek-api.nomoreparties.co/weblarek.postman.json). В коллекции путь заказа записан как `/order`, в коде используется `/order/` из ТЗ. Если сервер возвращает ошибку `{ error: string }`, её можно обработать в `catch`.

## Представления

Эти классы работают с HTML и находятся в `src/components/View/`. Метод `render` они получают от `Component`. Ниже описаны поля и методы, которые добавляет каждый класс. Сеттеры обновляют свойства и ничего не возвращают (`void`).

Конструкторы `Page`, `Modal`, `CatalogCard`, `PreviewCard`, `BasketCard`, `BasketView`, `Success` принимают `(container: HTMLElement, events: IEvents)` — HTML-элемент и объект для работы с событиями. У остальных классов параметры указаны отдельно.

### Page

Показывает каталог и количество товаров в корзине. Поля:

- `gallery: HTMLElement` — контейнер карточек.
- `counter: HTMLElement` — счётчик корзины.
- `basketButton: HTMLButtonElement` — кнопка открытия корзины.
- `events: IEvents` — объект событий.

Сеттеры `catalog: HTMLElement[]`, `count: number`, `locked: boolean` меняют карточки, счётчик и возможность нажимать на фоновую страницу. Метод `showMessage(message: string, retry = false): void` выводит сообщение о загрузке или ошибке и может добавить кнопку повтора.

### Modal

Открывает и закрывает модальное окно. Поля:

- `contentElement: HTMLElement` — место для содержимого окна.
- `closeButton: HTMLButtonElement` — кнопка закрытия.
- `previousFocus: HTMLElement | null = null` — элемент, который был выбран до открытия окна.
- `events: IEvents` — объект событий.

Методы и сеттеры:

- `content: HTMLElement` — меняет содержимое окна.
- `pending: boolean` — отмечает, что приложение ждёт ответ сервера.
- `open(content: HTMLElement, label: string): void` — открывает окно и задаёт его название.
- `close(): void` — закрывает окно и убирает содержимое.

Окно закрывается крестиком, нажатием на фон или Escape. При работе с клавиатурой выбор остаётся внутри окна, а после закрытия возвращается на прежнюю кнопку. Фоновая страница не прокручивается. В длинной корзине прокручивается только список товаров.

### Card, CatalogCard, PreviewCard, BasketCard

`Card` содержит общую часть карточек. Его конструктор — `protected constructor(container: HTMLElement)`. Поля:

- `titleElement: HTMLElement`, `priceElement: HTMLElement` — элементы с названием и ценой.
- `productId: string = ''` — идентификатор товара для событий.
- `categoryElement: HTMLElement | null`, `imageElement: HTMLImageElement | null` — категория и картинка. В карточке корзины этих элементов нет.

Сеттеры `id: string`, `title: string`, `price: number | null`, `category: string`, `image: string` обновляют соответствующие элементы. Цена `null` отображается как «Бесценно»; категория задаётся через `categoryMap`, изображение — через `CDN_URL`.

- `CatalogCard extends Card` — карточка в каталоге. По нажатию отправляет `product:select`. Новых полей и методов нет.
- `PreviewCard extends Card` — карточка в окне просмотра. Поля `descriptionElement: HTMLElement` и `button: HTMLButtonElement` хранят описание и кнопку. Поля `available: boolean = false` и `selected: boolean = false` показывают, можно ли купить товар и есть ли он в корзине. Сеттеры: `description: string`, `price: number | null`, `inBasket: boolean`. Метод `protected updateButton(): void` меняет текст кнопки на «Купить», «Удалить из корзины» или «Недоступно».
- `BasketCard extends Card` — строка в корзине. Поля `indexElement: HTMLElement` и `button: HTMLButtonElement` хранят номер строки и кнопку удаления. Сеттеры `index: number` и `title: string` меняют номер и название товара, а также подпись кнопки удаления.

### CardFactory

Создаёт карточки из HTML-шаблонов. Реализует `ICardFactory`. Конструктор `(events: IEvents, catalogTemplate: HTMLTemplateElement, basketTemplate: HTMLTemplateElement)` получает объект событий и два шаблона. Они сохраняются в полях с такими же именами и типами.

- `createCatalogCard(product: IProduct): HTMLElement` — создаёт карточку каталога.
- `createBasketCard(product: IProduct, index: number): HTMLElement` — создаёт строку корзины с номером, начиная с единицы.

### BasketView

Показывает содержимое корзины. Поля:

- `list: HTMLElement` — список товаров.
- `totalElement: HTMLElement` — общая стоимость.
- `button: HTMLButtonElement` — кнопка оформления.

Сеттеры `items: HTMLElement[]` и `total: number` обновляют товары и сумму. Если товаров нет, появляется «Корзина пуста», а кнопка оформления отключается. Метод `focusAfterRemoval(index: number): void` после удаления выбирает соседнюю строку для управления с клавиатуры.

### Form<T extends IFormView>

Общий класс для форм. Конструктор `(container: HTMLFormElement, events: IEvents, submitEvent: string)` получает HTML-форму, объект событий и имя события отправки. Поля:

- `submitButton: HTMLButtonElement` — кнопка отправки.
- `errorsElement: HTMLElement` — место для сообщений об ошибках.
- `isValid: boolean = false` — правильно ли заполнены поля.
- `isPending: boolean = false` — ожидается ли ответ сервера.
- `submitText: string` — исходный текст кнопки.

Сеттеры `errors: TBuyerErrors`, `serverError: string`, `valid: boolean`, `pending: boolean` меняют сообщения и включают или отключают форму. Методы `protected updateSubmit(): void` и `protected setInput(name: string, value: string): void` обновляют кнопку и поле ввода. Изменение данных отправляется через событие `buyer:change`. Во время запроса повторно отправить форму нельзя.

### OrderForm и ContactsForm

Оба конструктора принимают `(container: HTMLFormElement, events: IEvents)`.

- `OrderForm extends Form<IOrderFormView>` — оплата и адрес. Поле `paymentButtons: HTMLButtonElement[]` хранит кнопки оплаты. Сеттеры `payment: TPayment`, `address: string` отображают данные. Отправляет `order:next`.
- `ContactsForm extends Form<IContactsFormView>` — контакты. Новых полей нет. Сеттеры `email: string`, `phone: string` обновляют поля. Отправляет `order:submit`.

### Success

Показывает результат заказа. Поле `description: HTMLElement` — текст результата; сеттер `total: number` выводит сумму из ответа сервера. Кнопка отправляет `success:close`.

## Презентер App

Связывает действия пользователя, данные и элементы страницы. Конструктор принимает:

- `events: IEvents` — объект событий.
- `products: IProductsModel` — модель каталога.
- `basket: IBasketModel` — модель корзины.
- `buyer: IBuyerModel` — модель покупателя.
- `api: IWebLarekApi` — класс для запросов к серверу.
- `views: IAppViews` — компоненты страницы.
- `cards: ICardFactory` — объект для создания карточек.

Все параметры, кроме `events`, сохраняются в полях с теми же именами и типами. Поля `loading: boolean = false` и `submitting: boolean = false` показывают, идёт ли загрузка каталога или отправка заказа. Они помогают избежать повторных запросов.

Метод `start(): Promise<void>` запускает приложение и загружает каталог. Остальные методы объявлены с `protected` и используются внутри класса:

- `loadCatalog(): Promise<void>` — сохраняет ответ API в модели и отображает карточки или ошибку с повтором.
- `showProduct(id: string): void` — выбирает товар и открывает просмотр.
- `toggleProduct(id: string): void` — добавляет или удаляет товар и закрывает просмотр.
- `updateBasket(): void`, `showBasket(): void` — обновляют счётчик, строки и сумму, открывают корзину.
- `removeProduct(id: string): void` — удаляет строку с восстановлением фокуса.
- `updateForms(): void` — передаёт в формы данные покупателя и сообщения об ошибках.
- `showOrder(): void`, `showContacts(): void` — открывают форму оплаты и адреса, затем форму контактов. Переход к контактам доступен после заполнения первого шага.
- `submitOrder(): Promise<void>` — собирает и отправляет заказ. После успеха очищает корзину и покупателя, показывает сумму сервера; при ошибке сохраняет данные для повтора.

Имена событий находятся в `EVENTS` (`src/utils/constants.ts`):

- `catalog:load` — загрузить каталог. Данные не передаются.
- `basket:open` — открыть корзину. Данные не передаются.
- `product:select` — открыть товар. Передаётся `IProductEvent` с его `id`.
- `product:toggle` — добавить товар в корзину или убрать его. Передаётся `IProductEvent`.
- `basket:remove` — удалить товар из корзины. Передаётся `IProductEvent`.
- `buyer:change` — сохранить изменённое поле и проверить заполнение. Передаётся `Partial<IBuyer>`.
- `order:open` — открыть форму оплаты и адреса. Данные не передаются.
- `order:next` — перейти к контактам. Данные не передаются.
- `order:submit` — отправить заказ. Данные не передаются: `App` берёт их из моделей.
- `modal:open` — отключить нажатия на фоновую страницу. Данные не передаются.
- `modal:close` — включить фоновую страницу и сбросить выбранный товар. Данные не передаются.
- `success:close` — закрыть сообщение об успешном заказе. Данные не передаются.

## Проверка работы

После `npm run dev` нужно открыть страницу и консоль браузера. В ней показаны результаты проверки всех методов моделей: сохранение товаров, выбор товара, добавление и удаление из корзины, подсчёт суммы, заполнение и очистка данных покупателя. У каждого вывода есть подпись.

Для проверок используются отдельные объекты, поэтому тестовые товары и данные покупателя не попадают в работающий магазин. После проверок выполняется запрос каталога: товары сохраняются в модели и выводятся в консоль через её метод. В готовой сборке эти проверки отключены.

Корзина и данные покупателя хранятся до перезагрузки страницы. Заказ отправляется только после заполнения форм и нажатия «Оплатить».
