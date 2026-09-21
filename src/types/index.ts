export type ApiPostMethods = 'POST' | 'PUT' | 'DELETE';

export interface IApi {
    get<T extends object>(uri: string): Promise<T>;
    post<T extends object>(uri: string, data: object, method?: ApiPostMethods): Promise<T>;
}

export interface IProduct {
    id: string;
    description: string;
    image: string;
    title: string;
    category: string;
    price: number | null;
}

export type TPayment = 'card' | 'cash' | '';

export interface IBuyer {
    payment: TPayment;
    email: string;
    phone: string;
    address: string;
}

export type TBuyerErrors = Partial<Record<keyof IBuyer, string>>;

export interface IProductsResponse {
    total: number;
    items: IProduct[];
}

export interface IOrder extends IBuyer {
    payment: Exclude<TPayment, ''>;
    total: number;
    items: IProduct['id'][];
}

export interface IOrderResponse {
    id: string;
    total: number;
}

export interface IPageView {
    catalog: HTMLElement[];
    count: number;
}

export interface ICardView extends IProduct {
    inBasket: boolean;
    index: number;
}

export interface IBasketView {
    items: HTMLElement[];
    total: number;
}

export interface IFormView {
    errors: TBuyerErrors;
    valid: boolean;
    pending: boolean;
    serverError: string;
}

export interface IOrderFormView extends IFormView, Pick<IBuyer, 'payment' | 'address'> {}
export interface IContactsFormView extends IFormView, Pick<IBuyer, 'email' | 'phone'> {}

export interface IProductsModel {
    setItems(items: IProduct[]): void;
    getItems(): IProduct[];
    getItem(id: string): IProduct | undefined;
    setSelectedProduct(product: IProduct | null): void;
    getSelectedProduct(): IProduct | null;
}

export interface IBasketModel {
    getItems(): IProduct[];
    addItem(product: IProduct): void;
    removeItem(product: IProduct): void;
    clear(): void;
    getTotal(): number;
    getCount(): number;
    hasItem(id: string): boolean;
}

export interface IBuyerModel {
    setData(data: Partial<IBuyer>): void;
    getData(): IBuyer;
    clear(): void;
    validate(): TBuyerErrors;
}

export interface IWebLarekApi {
    getProducts(): Promise<IProductsResponse>;
    orderProducts(order: IOrder): Promise<IOrderResponse>;
}

export interface IView<T> {
    render(data?: Partial<T>): HTMLElement;
}

export interface IPageComponent extends IView<IPageView> {
    set catalog(items: HTMLElement[]);
    set count(value: number);
    set locked(value: boolean);
    showMessage(message: string, retry?: boolean): void;
}

export interface IModalView {
    content: HTMLElement;
}

export interface IModalComponent extends IView<IModalView> {
    open(content: HTMLElement, label: string): void;
    close(): void;
    set pending(value: boolean);
}

export interface IBasketComponent extends IView<IBasketView> {
    focusAfterRemoval(index: number): void;
}

export interface IFormComponent<T extends IFormView> extends IView<T> {
    set pending(value: boolean);
    set serverError(value: string);
}

export interface ISuccessView {
    total: number;
}

export interface IAppViews {
    page: IPageComponent;
    modal: IModalComponent;
    preview: IView<ICardView>;
    basket: IBasketComponent;
    order: IFormComponent<IOrderFormView>;
    contacts: IFormComponent<IContactsFormView>;
    success: IView<ISuccessView>;
}

export interface ICardFactory {
    createCatalogCard(product: IProduct): HTMLElement;
    createBasketCard(product: IProduct, index: number): HTMLElement;
}

export interface IProductEvent {
    id: IProduct['id'];
}
