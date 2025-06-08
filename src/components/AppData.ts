import { Model } from './common/Model';
import {
	IAppState,
	IOrderForm,
	FormErrors,
	IDeliveryForm,
	IContactsForm,
	ICard,
} from '../types';

export type CatalogChangeEvent = {
	catalog: ICard[];
};

export class AppState extends Model<IAppState> {
	basket: ICard[] = [];
	catalog: ICard[];
	order: IOrderForm = {
		payment: 'online',
		address: '',
		email: '',
		phone: '',
		total: 0,
		items: [],
	};
	preview: string | null = null;
	formErrors: FormErrors = {};

	addToBasket(item: ICard): void {
		if (item.price !== null && !this.basket.includes(item)) {
			this.basket.push(item);
			this.emitBasketChanges();
		}
	}

	removeFromBasket(item: ICard): void {
		const index = this.basket.indexOf(item);
		if (index !== -1) {
			this.basket.splice(index, 1);
			this.emitBasketChanges();
		}
	}

	clearBasket(): void {
		this.basket = [];
		this.emitBasketChanges();
	}

	private emitBasketChanges(): void {
		this.emitChanges('count:changed', this.basket);
		this.emitChanges('basket:changed', this.basket);
	}

	setDelivery(field: keyof IDeliveryForm, value: string): void {
		this.order[field] = value;
		if (this.validateDelivery()) {
			this.events.emit('delivery:ready', this.order);
		}
	}

	setContacts(field: keyof IContactsForm, value: string): void {
		this.order[field] = value;
		if (this.validateContacts()) {
			this.events.emit('contacts:ready', this.order);
		}
	}

	setCatalog(items: ICard[]): void {
		this.catalog = items;
		this.emitChanges('items:changed', { catalog: this.catalog });
	}

	setPreview(item: ICard): void {
		this.preview = item.id;
		this.emitChanges('preview:changed', item);
	}

	private validateDelivery(): boolean {
		const errors: FormErrors = {};

		if (!this.order.address) {
			errors.address = 'Необходимо указать адрес доставки';
		}

		this.updateFormErrors(errors);
		return this.isValid(errors);
	}

	private validateContacts(): boolean {
		const errors: FormErrors = {};

		if (!this.order.email) {
			errors.email = 'Необходимо указать email';
		}
		if (!this.order.phone) {
			errors.phone = 'Необходимо указать телефон';
		}

		this.updateFormErrors(errors);
		return this.isValid(errors);
	}

	private updateFormErrors(errors: FormErrors): void {
		this.formErrors = errors;
		this.events.emit('formErrors:change', this.formErrors);
	}

	private isValid(errors: FormErrors): boolean {
		return Object.keys(errors).length === 0;
	}
}

