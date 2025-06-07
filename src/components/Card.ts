import { Component } from './common/Component';
import { ICard, IActions } from '../types';

export class Card extends Component<ICard> {
	protected _title: HTMLElement | null;
	protected _image: HTMLImageElement | null;
	protected _description: HTMLElement | null;
	protected _button: HTMLButtonElement | null;
	protected _category: HTMLElement | null;
	protected _price: HTMLElement | null;
	protected _count: HTMLElement | null;

	constructor(container: HTMLElement, actions?: IActions) {
		super(container);

		this._title = container.querySelector('.card__title');
		this._image = container.querySelector('.card__image');
		this._button = container.querySelector('.card__button');
		this._description = container.querySelector('.card__text');
		this._category = container.querySelector('.card__category');
		this._price = container.querySelector('.card__price');
		this._count = container.querySelector('.basket__item-index');

		if (actions?.onClick) {
			if (this._button) {
				this._button.addEventListener('click', actions.onClick);
			} else {
				container.addEventListener('click', actions.onClick);
			}
		}
	}

	private _setImage(
		el: HTMLImageElement | null,
		src: string,
		alt: string
	): void {
		if (el) {
			el.src = src;
			el.alt = alt;
		}
	}

	set id(value: string) {
		this.container.dataset.id = value;
	}

	get id(): string {
		return this.container.dataset.id || '';
	}

	set title(value: string) {
		this.setText(this._title, value);
	}

	get title(): string {
		return this._title?.textContent || '';
	}

	set image(value: string) {
		this._setImage(this._image, value, this.title);
	}

	set description(value: string | string[]) {
		if (!this._description) return;

		if (Array.isArray(value)) {
			this._description.innerHTML = '';
			value.forEach((str) => {
				const p = document.createElement('p');
				p.textContent = str;
				this._description?.appendChild(p);
			});
		} else {
			this.setText(this._description, value);
		}
	}

	set button(value: string) {
		this.setText(this._button, value);
	}

	set buttonText(value: string) {
		if (this._button) {
			this._button.textContent = value;
		}
	}

	set category(value: string) {
		this.setText(this._category, value);
	}

	set price(value: number | null) {
		if (this._price) {
			this._price.textContent =
				value === null ? 'Бесценно' : `${value} синапсов`;
		}
	}

	get price(): number | null {
		if (!this._price) return null;
		const parsed = parseFloat(this._price.textContent || '');
		return isNaN(parsed) ? null : parsed;
	}
}
