import { Component } from './Component';
import { ensureElement } from '../../utils/utils';
import { IEvents } from '../base/events';
import { ISuccess, ISuccessActions } from '../../types';

interface IModalData {
	content: HTMLElement;
}

export class Modal extends Component<IModalData> {
	protected _closeButton: HTMLButtonElement;
	protected _content: HTMLElement;

	constructor(container: HTMLElement, protected events: IEvents) {
		super(container);

		this._closeButton = ensureElement<HTMLButtonElement>(
			'.modal__close',
			container
		);
		this._content = ensureElement<HTMLElement>('.modal__content', container);

		this._initEventListeners();
	}

	private _initEventListeners(): void {
		this._closeButton.addEventListener('click', this.close.bind(this));
		this.container.addEventListener('mousedown', this.close.bind(this));
		this._content.addEventListener('mousedown', (event) =>
			event.stopPropagation()
		);
	}

	set content(value: HTMLElement) {
		this._content.replaceChildren(value ?? null);
	}

	open(): void {
		this.toggle(true);
		this.events.emit('modal:open');
	}

	close(): void {
		this.toggle(false);
		this.content = null;
		this.events.emit('modal:close');
	}

	private toggle(state: boolean): void {
		this.container.classList.toggle('modal_active', state);
	}

	render(data: IModalData): HTMLElement {
		super.render(data);
		this.open();
		return this.container;
	}
}

export class Success extends Component<ISuccess> {
	private closeButton: HTMLElement;
	private totalDescription: HTMLElement;

	constructor(container: HTMLElement, actions: ISuccessActions) {
		super(container);

		this.closeButton = this.getElement('.order-success__close');
		this.totalDescription = this.getElement('.order-success__description');

		this.bindEvents(actions);
	}

	private getElement<T extends HTMLElement>(selector: string): T {
		return ensureElement<T>(selector, this.container);
	}

	private bindEvents(actions: ISuccessActions): void {
		if (actions?.onClick) {
			this.closeButton.addEventListener('click', actions.onClick);
		}
	}

	set total(value: string) {
		this.totalDescription.textContent = `Списано ${value} синапсов`;
	}
}