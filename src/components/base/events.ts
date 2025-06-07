import { EventName, Subscriber, EmitterEvent } from '../../types';

export interface IEvents {
	on<T extends object>(event: EventName, callback: (data: T) => void): void;
	emit<T extends object>(event: string, data?: T): void;
	trigger<T extends object>(
		event: string,
		context?: Partial<T>
	): (data: T) => void;
}

export class EventEmitter implements IEvents {
	private readonly events: Map<EventName, Set<Subscriber>>;

	constructor() {
		this.events = new Map<EventName, Set<Subscriber>>();
	}

	on<T extends object>(
		eventName: EventName,
		callback: (event: T) => void
	): void {
		if (!this.events.has(eventName)) {
			this.events.set(eventName, new Set<Subscriber>());
		}
		this.events.get(eventName)?.add(callback);
	}

	off(eventName: EventName, callback: Subscriber): void {
		const subscribers = this.events.get(eventName);
		if (!subscribers) return;

		subscribers.delete(callback);
		if (subscribers.size === 0) {
			this.events.delete(eventName);
		}
	}

	emit<T extends object>(eventName: string, data?: T): void {
		this.events.forEach((subscribers, name) => {
			if (this.isEventMatch(name, eventName)) {
				subscribers.forEach((callback) => callback(data));
			}
		});
	}

	onAll(callback: (event: EmitterEvent) => void): void {
		this.on('*', callback);
	}

	offAll(): void {
		this.events.clear();
	}

	trigger<T extends object>(
		eventName: string,
		context?: Partial<T>
	): (data: T) => void {
		return (event: object = {}) => {
			this.emit(eventName, {
				...event,
				...context,
			});
		};
	}

	private isEventMatch(pattern: EventName, eventName: string): boolean {
		return pattern instanceof RegExp
			? pattern.test(eventName)
			: pattern === eventName;
	}
}
