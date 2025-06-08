/*import { Api } from './base/api';
import {
	IOrderForm,
	IOrderResult,
	ICard,
	ApiListResponse,
	ILarekAPI,
} from '../types';

export class LarekAPI extends Api implements ILarekAPI {
	readonly cdn: string;

	constructor(cdn: string, baseUrl: string, options?: RequestInit) {
		super(baseUrl, options);
		this.cdn = cdn;
	}

	async getCardList(): Promise<ICard[]> {
		const data = (await this.get('/product')) as ApiListResponse<ICard>;

		if (!data || !data.items) {
			return [];
		}

		return data.items.map((item: ICard) => ({
			...item,
			image: item.image.startsWith('http') ? item.image : this.cdn + item.image,
		}));
	}
	
	async orderItems(order: IOrderForm): Promise<IOrderResult> {
		const data = (await this.post('/order', order)) as IOrderResult;
		return data;
	}
}*/

import { Api } from './base/api';
import { IOrderForm, IOrderResult, ICard, ApiListResponse, ILarekAPI } from '../types';

export class LarekAPI extends Api implements ILarekAPI {
    readonly cdn: string;

    constructor(cdn: string, baseUrl: string, options?: RequestInit) {
        super(baseUrl, options);
        this.cdn = cdn;
    }

    async getCardList(): Promise<ICard[]> {
        const data = (await this.get('/product')) as ApiListResponse<ICard>;
        return data.items.map((item) => ({
            ...item,
            image: item.image.startsWith('http') ? item.image : this.cdn + item.image,
        }));
    }

    async orderItems(order: IOrderForm): Promise<IOrderResult> {
        return (await this.post('/order', order)) as IOrderResult;
    }
}