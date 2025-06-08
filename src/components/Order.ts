import { Form } from './common/Form';
import { IDeliveryForm, IContactsForm, IActions } from '../types';
import { IEvents } from './base/events';
import { ensureElement } from '../utils/utils';

export class ContactsForm extends Form<IContactsForm> {
	constructor(container: HTMLFormElement, events: IEvents) {
		super(container, events);

		this.container.addEventListener('input', this.validate.bind(this));
		this.container.addEventListener('submit', this.validate.bind(this));
	}

	private validate(event: Event) {
		event.preventDefault();
		this.clearErrors();

		const email = this.container.elements.namedItem(
			'email'
		) as HTMLInputElement | null;
		const phone = this.container.elements.namedItem(
			'phone'
		) as HTMLInputElement | null;
		const address = this.container.elements.namedItem(
			'address'
		) as HTMLInputElement | null;

		let valid = true;

		const emailRegex = /^[a-zA-Z]+@[a-zA-Z]+\.[a-zA-Z]+$/;
		if (!email || !emailRegex.test(email.value)) {
			if (email) this.showError(email, 'Неверный email');
			valid = false;
		}

		const digitsOnly = phone?.value.replace(/[^\d]/g, '');
		if (
			!phone ||
			!/^\+?\d+$/.test(phone.value) ||
			(digitsOnly?.length ?? 0) < 10
		) {
			if (phone) this.showError(phone, 'Неверный телефон');
			valid = false;
		}

		if (
			!address ||
			!/[a-zA-Zа-яА-Я]/.test(address.value) ||
			!/\d/.test(address.value)
		) {
			if (address) this.showError(address, 'Неверный адрес');
			valid = false;
		}

		const submitButton = this.container.querySelector(
			'button[type="submit"]'
		) as HTMLButtonElement | null;
		if (submitButton) {
			submitButton.disabled = !valid;
		}

		if (valid && email && phone && address && event.type === 'submit') {
			this.events.emit('form:submit', {
				email: email.value,
				phone: phone.value,
				address: address.value,
			});
		}
	}

	private showError(input: HTMLInputElement, message: string) {
		const label = input.closest('label') || input.parentElement;

		if (label) {
			const error = document.createElement('div');
			error.className = 'form-error';
			error.textContent = message;
			label.appendChild(error);
		}

		input.classList.add('input-error');
	}

	private clearErrors() {
		this.container.querySelectorAll('.form-error').forEach((e) => e.remove());
		this.container
			.querySelectorAll('.input-error')
			.forEach((e) => e.classList.remove('input-error'));
	}

	set phone(value: string) {
		const phoneInput = this.container.querySelector(
			'[name="phone"]'
		) as HTMLInputElement | null;
		if (phoneInput) phoneInput.value = value;
	}

	set email(value: string) {
		const emailInput = this.container.querySelector(
			'[name="email"]'
		) as HTMLInputElement | null;
		if (emailInput) emailInput.value = value;
	}
}

export const PaymentMethod: Record<string, string> = {
	card: 'online',
	cash: 'cash',
};

export class DeliveryForm extends Form<IDeliveryForm> {
	protected _cardButton: HTMLButtonElement;
	protected _cashButton: HTMLButtonElement;

	constructor(container: HTMLFormElement, events: IEvents, actions: IActions) {
		super(container, events);

		this._cardButton = ensureElement<HTMLButtonElement>(
			'button[name="card"]',
			this.container
		);
		this._cashButton = ensureElement<HTMLButtonElement>(
			'button[name="cash"]',
			this.container
		);

		this._cardButton.classList.add('button_alt-active');

		if (actions?.onClick) {
			this._cardButton.addEventListener('click', actions.onClick);
			this._cashButton.addEventListener('click', actions.onClick);
		}
	}

	set address(value: string) {
		const addressInput = this.container.querySelector(
			'[name="address"]'
		) as HTMLInputElement | null;
		if (addressInput) addressInput.value = value;
	}

	changePayment() {
		this._cardButton.classList.toggle('button_alt-active');
		this._cashButton.classList.toggle('button_alt-active');
	}
}
