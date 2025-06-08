export function pascalToKebab(value: string): string {
	return value.replace(/([a-z0-9])([A-Z])/g, '$1-$2').toLowerCase();
}

export function isSelector(x: any): x is string {
	return typeof x === 'string' && x.length > 1;
}

export function isEmpty(value: any): boolean {
	return value === null || value === undefined;
}

export type SelectorCollection<T> = string | NodeListOf<Element> | T[];

export function ensureAllElements<T extends HTMLElement>(
	selectorElement: SelectorCollection<T>,
	context: HTMLElement = document as unknown as HTMLElement
): T[] {
	if (isSelector(selectorElement)) {
		return Array.from(context.querySelectorAll(selectorElement)) as T[];
	}
	if (selectorElement instanceof NodeList) {
		return Array.from(selectorElement) as T[];
	}
	if (Array.isArray(selectorElement)) {
		return selectorElement;
	}
	throw new Error(`Не верные данные`);
}

export type SelectorElement<T> = T | string;

export function ensureElement<T extends HTMLElement>(
	selectorElement: SelectorElement<T>,
	context?: HTMLElement
): T {
	if (isSelector(selectorElement)) {
		const elements = ensureAllElements<T>(selectorElement, context);
		if (elements.length > 1) {
			throw new Error(`Не верные данные ${selectorElement}`);
		}
		if (elements.length === 0) {
			throw new Error(`Не верные данные ${selectorElement}`);
		}
		return elements.pop() as T;
	}
	if (selectorElement instanceof HTMLElement) {
		return selectorElement as T;
	}
	throw new Error('Не верные данные');
}

export function cloneTemplate<T extends HTMLElement>(
	query: string | HTMLTemplateElement
): T {
	const template = ensureElement(query) as HTMLTemplateElement;
	return template.content.firstElementChild!.cloneNode(true) as T;
}

export function bem(
	block: string,
	element?: string,
	modifier?: string
): { name: string; class: string } {
	let name = block;
	if (element) name += `__${element}`;
	if (modifier) name += `_${modifier}`;
	return {
		name,
		class: `.${name}`,
	};
}

export function getObjectProperties(
	obj: object,
	filter?: (name: string, prop: PropertyDescriptor) => boolean
): string[] {
	return Object.entries(
		Object.getOwnPropertyDescriptors(Object.getPrototypeOf(obj))
	)
		.filter(([name, prop]: [string, PropertyDescriptor]) =>
			filter ? filter(name, prop) : name !== 'constructor'
		)
		.map(([name]) => name);
}

export function setElementData<T extends Record<string, unknown> | object>(
	el: HTMLElement,
	data: T
) {
	for (const key in data) {
		el.dataset[key] = String(data[key]);
	}
}

export function getElementData<
	T extends Record<string, unknown>,
	K extends keyof T
>(el: HTMLElement, scheme: Record<K, (value: string | undefined) => T[K]>): T {
	const data = {} as Partial<T>;
	for (const key in scheme) {
		data[key as K] = scheme[key](el.dataset[key]);
	}
	return data as T;
}

export function isPlainObject(obj: unknown): obj is object {
	const prototype = Object.getPrototypeOf(obj);
	return prototype === Object.getPrototypeOf({}) || prototype === null;
}

export function isBoolean(v: unknown): v is boolean {
	return typeof v === 'boolean';
}

export function createElement<T extends HTMLElement>(
	tagName: keyof HTMLElementTagNameMap,
	props?: Partial<Record<keyof T, string | boolean | object>>,
	children?: HTMLElement | HTMLElement[]
): T {
	const element = document.createElement(tagName) as T;
	if (props) {
		for (const key in props) {
			const value = props[key];
			if (isPlainObject(value) && key === 'dataset') {
				setElementData(element, value);
			} else {
				// @ts-expect-error поправить позже
				element[key] = isBoolean(value) ? value : String(value);
			}
		}
	}
	if (children) {
		for (const child of Array.isArray(children) ? children : [children]) {
			element.append(child);
		}
	}
	return element;
}
