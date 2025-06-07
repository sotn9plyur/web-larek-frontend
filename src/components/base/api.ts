import { ApiPostMethods } from '../../types';

export class Api {
	private readonly baseUrl: string;
	private readonly options: RequestInit;

	constructor(baseUrl: string, options: RequestInit = {}) {
		this.baseUrl = baseUrl;
		this.options = {
			headers: {
				'Content-Type': 'application/json',
				...((options.headers as object) ?? {}),
			},
		};
	}

	private async handleResponse(response: Response): Promise<object> {
		const data = await response.json();

		if (!response.ok) {
			return Promise.reject(data.error ?? response.statusText);
		}

		return data;
	}

	public async get(uri: string): Promise<object> {
		const response = await fetch(`${this.baseUrl}${uri}`, {
			...this.options,
			method: 'GET',
		});

		return this.handleResponse(response);
	}

	public async post(
		uri: string,
		data: object,
		method: ApiPostMethods = 'POST'
	): Promise<object> {
		const response = await fetch(`${this.baseUrl}${uri}`, {
			...this.options,
			method,
			body: JSON.stringify(data),
		});

		return this.handleResponse(response);
	}
}
