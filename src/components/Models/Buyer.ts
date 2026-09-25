import type { IBuyer, TBuyerErrors, TPayment } from '../../types';
import type { IEvents } from '../base/Events';
import { EVENTS } from '../../utils/constants';

export class Buyer {
    protected payment: TPayment = '';
    protected email = '';
    protected phone = '';
    protected address = '';

    constructor(protected events: IEvents) {}

    setData(data: Partial<IBuyer>): void {
        if (data.payment !== undefined) this.payment = data.payment;
        if (data.email !== undefined) this.email = data.email;
        if (data.phone !== undefined) this.phone = data.phone;
        if (data.address !== undefined) this.address = data.address;
        this.events.emit(EVENTS.buyerChanged);
    }

    getData(): IBuyer {
        return {
            payment: this.payment,
            email: this.email,
            phone: this.phone,
            address: this.address,
        };
    }

    clear(): void {
        this.payment = '';
        this.email = '';
        this.phone = '';
        this.address = '';
        this.events.emit(EVENTS.buyerChanged);
    }

    validate(): TBuyerErrors {
        const errors: TBuyerErrors = {};

        if (!this.payment) {
            errors.payment = 'Выберите способ оплаты';
        }
        if (!this.address) {
            errors.address = 'Укажите адрес доставки';
        }
        if (!this.email) {
            errors.email = 'Укажите электронную почту';
        }
        if (!this.phone) {
            errors.phone = 'Укажите телефон';
        }

        return errors;
    }
}
