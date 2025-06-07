export abstract class Component<T> {
	protected constructor(protected readonly container: HTMLElement) {}

	toggleClass(element: HTMLElement, className: string, force?: boolean): void {
		element.classList.toggle(className, force);
	}

	protected setText(element: HTMLElement, value: unknown): void {
		if (!element) return;
		element.textContent = String(value);
	}

	setDisabled(element: HTMLElement, state: boolean): void {
		if (!element) return;

		state
			? element.setAttribute('disabled', 'disabled')
			: element.removeAttribute('disabled');
	}

	protected setHidden(element: HTMLElement): void {
		element.style.display = 'none';
	}

	protected setVisible(element: HTMLElement): void {
		element.style.display = '';
	}

	protected setImage(
		element: HTMLImageElement,
		src: string,
		alt?: string
	): void {
		if (!element) return;

		element.src = src;
		if (alt) element.alt = alt;
	}

	render(data?: Partial<T>): HTMLElement {
		if (data) {
			Object.assign(this, data);
		}
		return this.container;
	}
}
