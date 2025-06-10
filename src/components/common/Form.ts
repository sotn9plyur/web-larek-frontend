import { Component } from './Component';
import { IEvents } from '../base/events';
import { ensureElement } from '../../utils/utils';
import { IFormState } from '../../types';

export class Form<T> extends Component<IFormState> {
	protected _submit: HTMLButtonElement;
	protected _errors: HTMLElement;
	protected _formFields: HTMLInputElement[];

	constructor(protected container: HTMLFormElement, protected events: IEvents) {
		super(container);

		this._submit = ensureElement<HTMLButtonElement>(
			'button[type=submit]',
			container
		);
		this._errors = ensureElement<HTMLElement>('.form__errors', container);
		this._formFields = Array.from(container.querySelectorAll('input'));

		this.setEventListeners();
		this.disableSubmit();
	}

	private disableSubmit(): void {
		this._submit.disabled = true;
	}

	private setEventListeners(): void {
		this.container.addEventListener('input', this.handleInput.bind(this));
		this.container.addEventListener('submit', this.handleSubmit.bind(this));

		this.events.on('formErrors:change', (errors: Record<string, string>) => {
			this.updateErrors(errors);
			this.updateSubmitState(errors);
		});
	}

	private updateErrors(errors: Record<string, string>): void {
		let errorMessage = '';

		this._formFields.forEach((field) => {
			const errorElement = field.nextElementSibling as HTMLElement;
			if (errorElement && errorElement.classList.contains('error-message')) {
				errorElement.textContent = '';
			}
		});

		for (const [field, message] of Object.entries(errors)) {
			const input = this.container.querySelector(`[name=${field}]`);
			if (input) {
				const errorElement = input.nextElementSibling as HTMLElement;
				if (errorElement && errorElement.classList.contains('error-message')) {
					errorElement.textContent = message;
				}
				errorMessage += `${message}\n`;
			}
		}

		this.setText(this._errors, errorMessage.trim());
	}

	private updateSubmitState(errors: Record<string, string>): void {
		this._submit.disabled = Object.keys(errors).length > 0;
	}

	private handleInput(e: Event): void {
		const target = e.target as HTMLInputElement;
		const field = target.name as keyof T;
		this.onInputChange(field, target.value);
	}

	private handleSubmit(e: Event): void {
		e.preventDefault();
		if (!this._submit.disabled) {
			this.events.emit(`${this.container.name}:submit`);
		}
	}

	protected onInputChange(field: keyof T, value: string): void {
		this.events.emit(`${this.container.name}.${String(field)}:change`, {
			field,
			value,
		});
	}

	set valid(value: boolean) {
		this._submit.disabled = !value;
	}

	set errors(value: string) {
		this.setText(this._errors, value);
	}

	render(state: Partial<T> & IFormState): HTMLFormElement {
		const { valid, errors, ...inputs } = state;
		super.render({ valid, errors });
		Object.assign(this, inputs);
		return this.container;
	}
}
