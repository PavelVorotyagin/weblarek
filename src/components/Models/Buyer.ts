import type { IBuyer, IBuyerModel, TBuyerErrors, TPayment } from '../../types';

export class Buyer implements IBuyerModel {
    protected payment: TPayment = '';
    protected email = '';
    protected phone = '';
    protected address = '';

    setData(data: Partial<IBuyer>): void {
        if (data.payment !== undefined) this.payment = data.payment;
        if (data.email !== undefined) this.email = data.email;
        if (data.phone !== undefined) this.phone = data.phone;
        if (data.address !== undefined) this.address = data.address;
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
    }

    validate(): TBuyerErrors {
        const errors: TBuyerErrors = {};

        if (this.payment !== 'card' && this.payment !== 'cash') {
            errors.payment = 'Выберите способ оплаты';
        }
        if (!this.address.trim()) {
            errors.address = 'Укажите адрес доставки';
        }
        if (!this.email.trim()) {
            errors.email = 'Укажите электронную почту';
        }
        if (!this.phone.trim()) {
            errors.phone = 'Укажите телефон';
        }

        return errors;
    }
}
