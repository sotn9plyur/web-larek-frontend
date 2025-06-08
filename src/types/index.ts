export type ApiPostMethods = 'POST' | 'PUT' | 'DELETE';

export interface ApiListResponse<T> {
	total: number;
	items: T[];
}

export type EventName = string | RegExp;
export type Subscriber = (...args: any[]) => void;
export interface EmitterEvent {
	eventName: string;
	data: unknown;
}

export interface IProductItem {
	id: string;
	title: string;
	description?: string;
	image?: string;
	category: string;
	price: number | null;
}

export interface IAppState {
	catalog: IProductItem[];
	basket: IProductItem[];
	preview: string | null;
	contact: IContactsForm | null;
	delivery: IDeliveryForm | null;
	order: IOrderForm | null;
}

export interface IContactsForm {
	email: string;
	phone: string;
}

export interface IDeliveryForm {
	payment: string;
	address: string;
}

export interface IOrderForm extends IContactsForm, IDeliveryForm {
	total: number;
	items: string[];
}

export interface IOrderResult {
	id: string;
	total: number;
}

export interface IPage {
	counter: number;
	catalog: HTMLElement[];
	locked: boolean;
}

export interface ICard extends IProductItem {
	count?: string;
	buttonText?: string;
}

export interface ISuccess {
	total: number | null;
}

export interface IBasketView {
	items: HTMLElement[];
	total: number;
}

export interface IFormState {
	valid: boolean;
	errors: string[];
}

export type FormErrors = Partial<Record<keyof IOrderForm, string>>;

export interface IModalData {
	content: HTMLElement;
}

export interface ILarekAPI {
	getCardList(): Promise<ICard[]>;
	orderItems(order: IOrderForm): Promise<IOrderResult>;
}

export interface IActions {
	onClick(event: MouseEvent): void;
}

export interface ISuccessActions {
	onClick(): void;
}
