import { Component } from './Component';
import { IEvents } from '../base/events';
import { ensureElement } from '../../utils/utils';
import { IFormState } from '../../types';

export class Form<T> extends Component<IFormState> {
	protected _submit: HTMLButtonElement;
	protected _errors: HTMLElement;

	constructor(protected container: HTMLFormElement, protected events: IEvents) {
		super(container);

		this._submit = ensureElement<HTMLButtonElement>(
			'button[type=submit]',
			container
		);
		this._errors = ensureElement<HTMLElement>('.form__errors', container);

		this.setEventListeners();
	}

	private setEventListeners(): void {
		this.container.addEventListener('input', this.handleInput.bind(this));
		this.container.addEventListener('submit', this.handleSubmit.bind(this));
	}

	private handleInput(e: Event): void {
		const target = e.target as HTMLInputElement;
		const field = target.name as keyof T;
		this.onInputChange(field, target.value);
	}

	private handleSubmit(e: Event): void {
		e.preventDefault();
		this.events.emit(`${this.container.name}:submit`);
		this._submit.disabled = false;
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


