# Проектная работа "Веб-ларек"

Стек: HTML, SCSS, TS, Vite

Структура проекта:
- src/ — исходные файлы проекта
- src/components/ — папка с JS компонентами
- src/components/base/ — папка с базовым кодом

Важные файлы:
- index.html — HTML-файл главной страницы
- src/types/index.ts — файл с типами
- src/main.ts — точка входа приложения
- src/scss/styles.scss — корневой файл стилей
- src/utils/constants.ts — файл с константами
- src/utils/utils.ts — файл с утилитами

## Установка и запуск
Для установки и запуска проекта необходимо выполнить команды

```
npm install
npm run dev
```

или

```
yarn
yarn dev
```
## Сборка

```
npm run build
```

или

```
yarn build
```
# Интернет-магазин «Web-Larёk»
«Web-Larёk» — это интернет-магазин с товарами для веб-разработчиков, где пользователи могут просматривать товары, добавлять их в корзину и оформлять заказы. Сайт предоставляет удобный интерфейс с модальными окнами для просмотра деталей товаров, управления корзиной и выбора способа оплаты, обеспечивая полный цикл покупки с отправкой заказов на сервер.

## Архитектура приложения

Код приложения разделен на слои согласно парадигме MVP (Model-View-Presenter), которая обеспечивает четкое разделение ответственности между классами слоев Model и View. Каждый слой несет свой смысл и ответственность:

Model - слой данных, отвечает за хранение и изменение данных.  
View - слой представления, отвечает за отображение данных на странице.  
Presenter - презентер содержит основную логику приложения и  отвечает за связь представления и данных.

Взаимодействие между классами обеспечивается использованием событийно-ориентированного подхода. Модели и Представления генерируют события при изменении данных или взаимодействии пользователя с приложением, а Презентер обрабатывает эти события используя методы как Моделей, так и Представлений.

### Базовый код

#### Класс Component
Является базовым классом для всех компонентов интерфейса.
Класс является дженериком и принимает в переменной `T` тип данных, которые могут быть переданы в метод `render` для отображения.

Конструктор:  
`constructor(container: HTMLElement)` - принимает ссылку на DOM элемент за отображение, которого он отвечает.

Поля класса:  
`container: HTMLElement` - поле для хранения корневого DOM элемента компонента.

Методы класса:  
`render(data?: Partial<T>): HTMLElement` - Главный метод класса. Он принимает данные, которые необходимо отобразить в интерфейсе, записывает эти данные в поля класса и возвращает ссылку на DOM-элемент. Предполагается, что в классах, которые будут наследоваться от `Component` будут реализованы сеттеры для полей с данными, которые будут вызываться в момент вызова `render` и записывать данные в необходимые DOM элементы.  
`setImage(element: HTMLImageElement, src: string, alt?: string): void` - утилитарный метод для модификации DOM-элементов `<img>`


#### Класс Api
Содержит в себе базовую логику отправки запросов.

Конструктор:  
`constructor(baseUrl: string, options: RequestInit = {})` - В конструктор передается базовый адрес сервера и опциональный объект с заголовками запросов.

Поля класса:  
`baseUrl: string` - базовый адрес сервера  
`options: RequestInit` - объект с заголовками, которые будут использованы для запросов.

Методы:  
`get(uri: string): Promise<object>` - выполняет GET запрос на переданный в параметрах ендпоинт и возвращает промис с объектом, которым ответил сервер  
`post(uri: string, data: object, method: ApiPostMethods = 'POST'): Promise<object>` - принимает объект с данными, которые будут переданы в JSON в теле запроса, и отправляет эти данные на ендпоинт переданный как параметр при вызове метода. По умолчанию выполняется `POST` запрос, но метод запроса может быть переопределен заданием третьего параметра при вызове.  
`handleResponse(response: Response): Promise<object>` - защищенный метод проверяющий ответ сервера на корректность и возвращающий объект с данными полученный от сервера или отклоненный промис, в случае некорректных данных.

#### Класс EventEmitter
Брокер событий реализует паттерн "Наблюдатель", позволяющий отправлять события и подписываться на события, происходящие в системе. Класс используется для связи слоя данных и представления.

Конструктор класса не принимает параметров.

Поля класса:  
`_events: Map<string | RegExp, Set<Function>>)` -  хранит коллекцию подписок на события. Ключи коллекции - названия событий или регулярное выражение, значения - коллекция функций обработчиков, которые будут вызваны при срабатывании события.

Методы класса:  
`on<T extends object>(event: EventName, callback: (data: T) => void): void` - подписка на событие, принимает название события и функцию обработчик.  
`emit<T extends object>(event: string, data?: T): void` - инициализация события. При вызове события в метод передается название события и объект с данными, который будет использован как аргумент для вызова обработчика.  
`trigger<T extends object>(event: string, context?: Partial<T>): (data: T) => void` - возвращает функцию, при вызове которой инициализируется требуемое в параметрах событие с передачей в него данных из второго параметра.

Данные

В первой части проекта реализована работа с данными и сервером. Во второй части добавляются представления и обработка событий. Все новые типы находятся в src/types/index.ts; принятые типы первой части сохраняются.

Товар и покупатель

interface IProduct { id: string; description: string; image: string; title: string; category: string; price: number | null; }

type TPayment = 'card' | 'cash' | '';

interface IBuyer { payment: TPayment; email: string; phone: string; address: string; }

type TBuyerErrors = Partial&lt;Record&lt;keyof IBuyer, string&gt;&gt;;

- IProduct - данные товара: идентификатор, описание, путь к изображению, название, категория и цена. Если цена равна null, товар недоступен для покупки.
- TPayment - способ оплаты. Значение card означает оплату картой, cash - наличными. Пустая строка нужна для начального состояния, когда способ ещё не выбран.
- IBuyer - способ оплаты и контактные данные покупателя.
- TBuyerErrors - сообщения об ошибках по полям покупателя. Правильно заполненного поля в объекте ошибок нет.

Данные запросов и ответов

interface IProductsResponse { total: number; items: IProduct[]; }

interface IOrder extends IBuyer { payment: Exclude&lt;TPayment, ''&gt;; total: number; items: IProduct['id'][]; }

interface IOrderResponse { id: string; total: number; }

- IProductsResponse - ответ сервера: количество товаров и массив товаров.
- IOrder - данные покупателя, сумма заказа и идентификаторы выбранных товаров. Пустой способ оплаты исключён, так как для заказа его нужно выбрать.
- IOrderResponse - ответ после оформления: идентификатор заказа и сумма.

Модели данных

В папке src/components/Models находятся три класса. У каждой модели своя задача. Они не обращаются к HTML, не делают запросы и не зависят друг от друга. Поля моделей объявлены с protected, для работы с ними используются методы. Во второй части каждый конструктор принимает events: IEvents и сохраняет его в protected events: IEvents. Методы изменения данных отправляют события, остальные методы работают как в первой части.

Products

Хранит каталог и выбранный товар. Файл: src/components/Models/Products.ts.

Конструктор: constructor(events: IEvents). Принимает брокер событий.

Поля:

- items: IProduct[] = [] - все товары каталога.
- selectedProduct: IProduct | null = null - товар для подробного просмотра. Значение null означает, что товар не выбран.

Методы:

- setItems(items: IProduct[]): void - сохраняет переданный массив.
- getItems(): IProduct[] - возвращает массив каталога.
- getItem(id: string): IProduct | undefined - ищет товар по идентификатору. Если товар не найден, возвращает undefined.
- setSelectedProduct(product: IProduct): void - запоминает выбранный товар.
- getSelectedProduct(): IProduct | null - возвращает выбранный товар.

Basket

Хранит товары для покупки. Файл: src/components/Models/Basket.ts.

Конструктор: constructor(events: IEvents). Принимает брокер событий.

Поле items: IProduct[] = [] - массив товаров корзины.

Методы:

- getItems(): IProduct[] - возвращает массив корзины.
- addItem(product: IProduct): void - добавляет переданный товар в массив корзины.
- removeItem(product: IProduct): void - удаляет товар по его id.
- clear(): void - очищает корзину.
- getTotal(): number - возвращает сумму цен. Для пустой корзины результат равен 0.
- getCount(): number - возвращает количество товаров.
- hasItem(id: string): boolean - проверяет, есть ли товар в корзине.

Buyer

Хранит и проверяет данные покупателя. Файл: src/components/Models/Buyer.ts.

Конструктор: constructor(events: IEvents). Принимает брокер событий. Все поля изначально содержат пустые строки.

Поля:

- payment: TPayment - способ оплаты.
- email: string - почта.
- phone: string - телефон.
- address: string - адрес доставки.

Методы:

- setData(data: Partial&lt;IBuyer&gt;): void - обновляет только переданные поля. Например, изменение телефона не удаляет сохранённый адрес. Значения undefined пропускаются.
- getData(): IBuyer - возвращает новый объект со всеми данными покупателя.
- clear(): void - возвращает поля в начальное состояние.
- validate(): TBuyerErrors - возвращает сообщения об ошибках для незаполненных полей.

Метод проверяет, что способ оплаты, адрес, почта и телефон не пустые. Если все поля заполнены, метод возвращает пустой объект.

Слой коммуникации

WebLarekApi

Получает каталог и отправляет заказ. Файл: src/components/WebLarekApi.ts.

Конструктор: constructor(api: IApi). Принимает объект с методами get и post. В main.ts передаётся экземпляр базового класса Api. Это композиция: класс использует готовый объект, а не наследуется от него.

Поле protected api: IApi хранит этот объект.

Методы:

- getProducts(): Promise&lt;IProductsResponse&gt; - вызывает get для /product/ и возвращает весь ответ с полями total и items.
- orderProducts(order: IOrder): Promise&lt;IOrderResponse&gt; - вызывает post для /order/, передаёт заказ и возвращает подтверждение.

Коллекция Postman: https://larek-api.nomoreparties.co/weblarek.postman.json

Ошибку запроса можно обработать через catch. При загрузке страницы запрашивается каталог. Заказ отправляется только после заполнения форм и нажатия кнопки оплаты.

Настройка и запуск

До запуска создайте в корне файл .env по примеру .env.example:

VITE_API_ORIGIN=https://larek-api.nomoreparties.co

Адрес указывается без слеша в конце. Полный адрес запросов берётся из API_URL в src/utils/constants.ts. Файл .env не отправляется в Git.

После npm run dev откройте страницу по адресу Vite. Команда npm run build проверяет TypeScript и собирает проект. Проверочный код первой части удалён из main.ts.

Представления

Классы находятся в src/components/View. Каждый класс отвечает за свой блок HTML. DOM-элементы ищутся в конструкторе и сохраняются в protected-полях, обработчики устанавливаются один раз. Данные товаров и покупателя в представлениях не сохраняются. Общий render(data?: Partial&lt;T&gt;): HTMLElement наследуется от Component и без аргументов возвращает элемент компонента. Сеттеры только обновляют разметку и ничего не возвращают.

Header, BasketView, Modal, PreviewCard, Form и Success сохраняют переданный брокер в поле protected events: IEvents и вызывают this.events.emit(). OrderForm и ContactsForm получают это поле от Form. CatalogCard и BasketCard используют переданный обработчик нажатия.

Типы представлений добавляются в src/types/index.ts:

- ICatalogView: items: HTMLElement[] - карточки каталога.
- IHeaderView: count: number - количество товаров в корзине.
- TCardView: Pick&lt;IProduct, 'title' | 'price' | 'category' | 'image'&gt; - поля карточки каталога.
- IPreviewView: TCardView и description: IProduct['description'], buttonText: string, disabled: boolean - подробная карточка и состояние кнопки.
- IBasketCardView: Pick&lt;IProduct, 'title' | 'price'&gt; и index: number - строка корзины.
- IBasketView: items: HTMLElement[], total: number, disabled: boolean - содержимое корзины и кнопка оформления.
- IFormState: valid: boolean, errors: string - состояние формы.
- IOrderFormView: IFormState и Pick&lt;IBuyer, 'payment' | 'address'&gt; - первый шаг.
- IContactsFormView: IFormState и Pick&lt;IBuyer, 'email' | 'phone'&gt; - второй шаг.
- IModalView: content: HTMLElement - содержимое модального окна.
- ISuccessView: total: IOrderResponse['total'] - сумма оформленного заказа.
- IProductEvent: id: IProduct['id'] - идентификатор товара в событии.

Catalog

Конструктор constructor(container: HTMLElement) принимает элемент gallery. Собственных полей нет. Сеттер items: HTMLElement[] заменяет содержимое каталога переданными карточками.

Header

Конструктор constructor(container: HTMLElement, events: IEvents) принимает шапку и брокер. Поля basketButton: HTMLButtonElement и counter: HTMLElement хранят кнопку корзины и счётчик. Сеттер count: number обновляет счётчик. Кнопка отправляет событие basket:open.

Card

Абстрактный общий родитель трёх карточек, наследует Component. Параметр типа T расширяет Pick&lt;IProduct, 'title' | 'price'&gt;. Конструктор protected constructor(container: HTMLElement). Поля titleElement: HTMLElement и priceElement: HTMLElement хранят название и цену, которые есть во всех трёх карточках.

Сеттеры title: string и price: number | null обновляют название и цену. При цене null выводится «Бесценно».

CatalogCard

Наследует Card. Конструктор constructor(container: HTMLElement, onClick: () =&gt; void) принимает карточку и обработчик нажатия, созданный брокером событий. Поля categoryElement: HTMLElement и imageElement: HTMLImageElement находятся через ensureElement. Сеттер title: string обновляет название через родителя и альтернативный текст картинки; category: string применяет categoryMap; image: string устанавливает переданный полный адрес изображения. Нажатие вызывает переданный обработчик выбора товара.

PreviewCard

Наследует Card. Конструктор constructor(container: HTMLElement, events: IEvents). Поля categoryElement: HTMLElement, imageElement: HTMLImageElement, descriptionElement: HTMLElement и button: HTMLButtonElement находятся через ensureElement и хранят категорию, картинку, описание и кнопку. Сеттеры title: string, category: string и image: string работают так же, как в CatalogCard. Полный адрес картинки подготавливает презентер. Сеттеры description: string, buttonText: string, disabled: boolean обновляют описание и кнопку. Текст и доступность кнопки определяет презентер. Нажатие отправляет product:toggle.

BasketCard

Наследует Card. Конструктор constructor(container: HTMLElement, onClick: () =&gt; void). Поля indexElement: HTMLElement и button: HTMLButtonElement хранят номер и кнопку удаления. Сеттер index: number обновляет номер строки. Нажатие вызывает переданный обработчик удаления товара.

BasketView

Конструктор constructor(container: HTMLElement, events: IEvents). Поля list: HTMLElement, totalElement: HTMLElement и button: HTMLButtonElement хранят список, сумму и кнопку. Сеттер items: HTMLElement[] заменяет дочерние элементы списка переданными строками. Сеттеры total: number и disabled: boolean обновляют сумму и кнопку оформления. Кнопка отправляет order:open. При пустом списке надпись «Корзина пуста» показывает правило из basket.scss, отдельного HTML-элемента для неё нет.

Modal

Конструктор constructor(container: HTMLElement, events: IEvents). Поля contentElement: HTMLElement и closeButton: HTMLButtonElement хранят область содержимого и крестик. Сеттер content: HTMLElement заменяет содержимое. Методы open(): void и close(): void добавляют и удаляют modal_active. Крестик и клик по фону отправляют modal:close, закрытие выполняет презентер. Наследников у Modal нет, все внутренние компоненты самостоятельны.

Form

Абстрактный общий родитель форм, параметр типа T расширяет IFormState. Конструктор constructor(container: HTMLFormElement, events: IEvents, submitEvent: string). Поля submitButton: HTMLButtonElement и errorsElement: HTMLElement хранят кнопку и сообщение об ошибках. Сеттер valid: boolean включает или отключает отправку, errors: string выводит ошибку. При submit форма предотвращает перезагрузку страницы и отправляет указанное событие. Проверок заполнения внутри формы нет.

OrderForm

Наследует Form. Конструктор constructor(container: HTMLFormElement, events: IEvents). Поля addressInput: HTMLInputElement, cardButton: HTMLButtonElement, cashButton: HTMLButtonElement хранят адрес и способы оплаты. Сеттеры address: string и payment: TPayment отображают данные. Для выбранной оплаты применяется button_alt-active. Изменения отправляют buyer:change, отправка формы - order:next.

ContactsForm

Наследует Form. Конструктор constructor(container: HTMLFormElement, events: IEvents). Поля emailInput: HTMLInputElement и phoneInput: HTMLInputElement хранят контакты. Сеттеры email: string и phone: string обновляют поля. Изменения отправляют buyer:change, отправка формы - order:submit.

Success

Конструктор constructor(container: HTMLElement, events: IEvents). Поля descriptionElement: HTMLElement и button: HTMLButtonElement хранят сообщение и кнопку возврата. Сеттер total: number выводит сумму из ответа сервера. Кнопка отправляет success:close.

События

Имена находятся в EVENTS в src/utils/constants.ts.

События моделей, без дополнительных данных:

- products:changed - Products.setItems сохранил каталог.
- product:changed - Products.setSelectedProduct сохранил выбранный товар.
- basket:changed - Basket.addItem, removeItem или clear изменил корзину.
- buyer:changed - Buyer.setData или clear изменил данные покупателя.

События представлений:

- product:select, данные IProductEvent - выбрана карточка каталога.
- product:toggle, без данных - нажата кнопка покупки или удаления в подробной карточке.
- basket:remove, данные IProductEvent - нажато удаление строки корзины.
- basket:open, без данных - нажата корзина в шапке.
- order:open, без данных - нажато оформление корзины.
- order:next, без данных - отправлена форма оплаты и адреса.
- order:submit, без данных - отправлена форма контактов.
- buyer:change, данные Partial&lt;IBuyer&gt; - изменено поле или выбрана оплата.
- modal:close, без данных - нажат крестик или фон окна.
- success:close, без данных - нажата кнопка возврата после покупки.

Презентер

Код находится в main.ts, отдельного класса нет. Все экземпляры сохраняются в переменные, включая api: Api, который передаётся в WebLarekApi. После создания объектов регистрируются обработчики, затем вызываются basketModel.clear() и buyerModel.clear(). События моделей задают начальное состояние шапки, корзины и форм. После этого выполняется запрос каталога и сохранение ответа в Products. Переменных состояния в презентере нет.

Вспомогательные функции презентера:

- getOrderState(): IOrderFormView - получает из модели оплату, адрес и ошибки первого шага.
- getContactsState(): IContactsFormView - получает контакты и ошибки второго шага.
- renderBasket(): HTMLElement - создаёт строки по данным модели и возвращает разметку корзины. Вызывается только в обработчике basket:changed.
- openModal(content: HTMLElement): void - передаёт содержимое в Modal и открывает окно.

- products:changed получает каталог из модели, создаёт карточки и передаёт их в Catalog.
- product:select находит товар по id и сохраняет его как выбранный. product:changed получает этот товар, подготавливает кнопку и открывает просмотр.
- product:toggle получает выбранный товар, проверяет его наличие в корзине, вызывает addItem или removeItem и закрывает окно. Для товара без цены кнопка заранее отключается в product:changed.
- basket:remove вызывает removeItem. basket:changed обновляет строки, сумму, доступность оформления и счётчик.
- basket:open передаёт в окно basket.render() без пересоздания строк. order:open и order:next открывают формы через render() без аргументов. Доступность кнопок определяется в обработчиках событий моделей, повторных проверок после нажатий нет.
- buyer:change сохраняет данные через setData. buyer:changed получает данные и ошибки из Buyer и передаёт каждой форме только нужные поля и ошибки.
- order:submit собирает IOrder из моделей и вызывает API. При сборке поле payment приводится к IOrder['payment'], так как к моменту доступной отправки оплата уже выбрана. При успехе clear очищает корзину и покупателя, затем открывается Success с суммой ответа сервера. При ошибке данные остаются, форма контактов открывается с сообщением без повторного заполнения полей.
- modal:close и success:close закрывают окно.

Каталог, корзина, данные форм и доступность кнопок обновляются в обработчиках событий моделей. При открытии корзины и форм используется готовая разметка. Результат заказа и сообщение об ошибке передаются при открытии соответствующего окна. Презентер не вызывает emit. Для карточек брокер создаёт обработчики через trigger; эти функции передаются в конструкторы и вызываются только по нажатию пользователя. Тестовые вызовы моделей и выводы в консоль из первой части удалены.
