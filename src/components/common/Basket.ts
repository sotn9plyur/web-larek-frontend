import { Component } from './Component';
import { createElement } from '../../utils/utils';
import { EventEmitter } from '../base/events';
import { IBasketView } from '../../types';

export class Basket extends Component<IBasketView> {
	protected _list: HTMLElement;
	protected _total: HTMLElement;
	protected _button: HTMLButtonElement;

	constructor(container: HTMLElement, protected events: EventEmitter) {
		super(container);

		this._list = this.container.querySelector('.basket__list');
		this._total = this.container.querySelector('.basket__price');
		this._button = this.container.querySelector('.basket__button');

		this.initEventListeners();
		this.items = [];
	}

	private initEventListeners(): void {
		this._button?.addEventListener('click', () => {
			this.events.emit('order:open');
		});
	}

	set items(items: HTMLElement[]) {
		if (items.length) {
			this._list.replaceChildren(...items);
			this.setButtonState(false);
		} else {
			this.showEmptyState();
			this.setButtonState(true);
		}
	}

	set total(total: number) {
		this.setText(this._total, `${total} синапсов`);
	}

	private showEmptyState(): void {
		this._list.replaceChildren(
			createElement<HTMLParagraphElement>('p', {
				textContent: 'Корзина пуста',
			})
		);
	}

	private setButtonState(disabled: boolean): void {
		if (this._button) {
			this._button.disabled = disabled;
		}
	}
}
