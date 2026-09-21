import type { IApi, IOrder, IOrderResponse, IProductsResponse, IWebLarekApi } from '../types';

export class WebLarekApi implements IWebLarekApi {
    protected api: IApi;

    constructor(api: IApi) {
        this.api = api;
    }

    getProducts(): Promise<IProductsResponse> {
        return this.api.get<IProductsResponse>('/product/');
    }

    orderProducts(order: IOrder): Promise<IOrderResponse> {
        return this.api.post<IOrderResponse>('/order/', order);
    }
}
