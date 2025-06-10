import { Model } from './common/Model';
import {
    IAppState,
    IOrderForm,
    FormErrors,
    IDeliveryForm,
    IContactsForm,
    ICard,
    IOrderData
} from '../types';

export type CatalogChangeEvent = {
    catalog: ICard[];
};

export class AppState extends Model<IAppState> {
    basket: ICard[] = [];
    catalog: ICard[] = [];
    order: IOrderForm = {
        payment: 'online',
        address: '',
        email: '',
        phone: '',
    };
    preview: string | null = null;
    formErrors: FormErrors = {};

    addToBasket(item: ICard) {
        if (item.price !== null && !this.basket.includes(item)) {
            this.basket.push(item);
            this.emitChanges('count:changed', this.basket);
            this.emitChanges('basket:changed', this.basket);
        }
    }

    removeFromBasket(item: ICard) {
        const index = this.basket.indexOf(item);
        if (index !== -1) {
            this.basket.splice(index, 1);
            this.emitChanges('count:changed', this.basket);
            this.emitChanges('basket:changed', this.basket);
        }
    }

    clearBasket() {
        this.basket = [];
        this.emitChanges('count:changed', this.basket);
        this.emitChanges('basket:changed', this.basket);
    }

    setDelivery(field: keyof IDeliveryForm, value: string) {
        this.order[field] = value;
        this.validateDelivery();
    }

    setContacts(field: keyof IContactsForm, value: string) {
        this.order[field] = value;
        this.validateContacts();
    }

    setCatalog(items: ICard[]) {
        this.catalog = items;
        this.emitChanges('items:changed', { catalog: this.catalog });
    }

    setPreview(item: ICard) {
        this.preview = item.id;
        this.emitChanges('preview:changed', item);
    }

    validateDelivery() {
        const errors: typeof this.formErrors = {};
        if (!this.order.address) {
            errors.address = 'Неверный адрес';
        }
        this.formErrors = errors;
        this.events.emit('formErrors:change', this.formErrors);
        return Object.keys(errors).length === 0;
    }

    validateContacts() {
        const errors: typeof this.formErrors = {};
        if (!this.order.email) {
            errors.email = 'Неверный email';
        }
        if (!this.order.phone) {
            errors.phone = 'Неверный телефон';
        }
        this.formErrors = errors;
        this.events.emit('formErrors:change', this.formErrors);
        return Object.keys(errors).length === 0;
    }

    getOrderData(): IOrderData {
        return {
            ...this.order,
            items: this.basket.map(item => item.id),
            total: this.getTotal()
        };
    }

    getTotal(): number {
        return this.basket.reduce((sum, item) => sum + (item.price || 0), 0);
    }
}