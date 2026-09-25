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

export interface ICatalogView {
    items: HTMLElement[];
}

export interface IHeaderView {
    count: number;
}

export type TCardView = Pick<IProduct, 'title' | 'price' | 'category' | 'image'>;

export interface IPreviewView extends TCardView {
    description: IProduct['description'];
    buttonText: string;
    disabled: boolean;
}

export interface IBasketCardView extends Pick<IProduct, 'title' | 'price'> {
    index: number;
}

export interface IBasketView {
    items: HTMLElement[];
    total: number;
    disabled: boolean;
}

export interface IFormState {
    valid: boolean;
    errors: string;
}

export interface IOrderFormView extends IFormState, Pick<IBuyer, 'payment' | 'address'> {}

export interface IContactsFormView extends IFormState, Pick<IBuyer, 'email' | 'phone'> {}

export interface IModalView {
    content: HTMLElement;
}

export interface ISuccessView {
    total: IOrderResponse['total'];
}

export interface IProductEvent {
    id: IProduct['id'];
}
