Проектная работа "Веб-ларек"
Стек: HTML, SCSS, TS, Webpack

Структура проекта:

src/ — исходные файлы проекта
src/components/ — папка с JS компонентами
src/components/base/ — папка с базовым кодом
Важные файлы:

src/pages/index.html — HTML-файл главной страницы
src/types/index.ts — файл с типами
src/index.ts — точка входа приложения
src/scss/styles.scss — корневой файл стилей
src/utils/constants.ts — файл с константами
src/utils/utils.ts — файл с утилитами
Установка и запуск
Для установки и запуска проекта необходимо выполнить команды

npm install
npm run start
или

yarn
yarn start
Сборка
npm run build
или

yarn build
Конечно! Вот слегка изменённая версия твоего описания архитектуры, чтобы оно сохраняло тот же смысл, но выглядело по-другому:

---

MVP-архитектура

Проект реализован с применением архитектурного паттерна MVP (Model-View-Presenter), который разбивает приложение на три ключевые компоненты:

Model — отвечает за управление данными и реализацию бизнес-логики. Здесь происходит загрузка, обновление и удаление данных, а также все необходимые вычисления.
View — отвечает за пользовательский интерфейс. Обеспечивает отображение данных, реагирует на действия пользователя (клики, заполнение форм и т. д.) и выполняет валидацию.
Presenter — выступает связующим звеном между моделью и представлением. Он обрабатывает пользовательские действия и обновляет интерфейс в ответ на изменения данных.

---

Базовые классы

EventEmitter
Общий класс-наблюдатель, позволяющий генерировать события и подписываться на них. Это облегчает взаимодействие между различными частями приложения через событийную модель.

Основной функционал:

`on(event, handler)` — подписка на событие.
`off(event, handler)` — удаление обработчика события.
`emit(event, data)` — вызов события с данными.
`onAll(handler)` — подписка на все события.
`offAll(handler)` — удаление универсальной подписки.
`trigger(name, callback)` — связывает вызов коллбэка с определённым событием.

Api
Базовый модуль для работы с HTTP-запросами к серверу. Поддерживает стандартные методы взаимодействия: GET, POST, PUT, DELETE.

Методы:

`handleResponse(response)` — обрабатывает ответ, преобразуя его в JSON или выбрасывает ошибку.
`get(url)` — отправка GET-запроса.
`post(url, data, method)` — универсальный метод для POST/PUT/DELETE-запросов.

Model
Родительский класс для всех моделей данных, управляющий логикой и хранением состояния.

Методы:

`emitChanges()` — уведомляет подписчиков об изменениях в модели.

Component
Базовая сущность для UI-компонентов, обеспечивающая управление DOM-элементами и визуальной логикой.

Основные методы:

`toggleClass(className)` — переключает CSS-класс.
`setText(text)` — устанавливает текстовый контент.
`setDisabled(state)` — блокирует/разблокирует элемент.
`setHidden()` — скрывает компонент.
`setVisible()` — делает компонент видимым.
`setImage(src, alt)` — задаёт изображение и альтернативный текст.
`render()` — возвращает DOM-элемент компонента.

---

Класс `AppState`

Класс, управляющий глобальным состоянием приложения. Хранит данные, необходимые различным компонентам, и предоставляет методы для их изменения и валидации.

Основные методы:

`addToBasket(item: IProductItem)` — добавляет товар в корзину.
`removeFromBasket(item: IProductItem)` — удаляет товар из корзины.
`clearBasket()` — полностью очищает корзину.
`setDelivery(data: IDeliveryForm)` — сохраняет информацию о доставке.
`setContacts(data: IContactsForm)` — сохраняет контактные данные пользователя.
`setCatalog(items: IProductItem[])` — устанавливает список товаров.
`setPreview(id: string | null)` — сохраняет ID выбранного товара для предпросмотра.
`validateDelivery(): IFormState` — проверяет валидность формы доставки.
`validateContacts(): IFormState` — проверяет валидность контактной формы.

Используемый тип:

interface IAppState {
	catalog: IProductItem[];
	basket: IProductItem[];
	preview: string | null;
	contact: IContactsForm | null;
	delivery: IDeliveryForm | null;
	order: IOrderForm | null;
}

Компоненты представления

`ContactsForm`

Компонент, отвечающий за отображение и обработку формы контактных данных. Используется при оформлении заказа. Наследуется от `Component`.


interface IContactsForm {
	email: string;
	phone: string;
}

`DeliveryForm`

Управляет вводом и выбором данных, связанных с доставкой заказа. Также основан на `Component`.


interface IDeliveryForm {
	payment: string;
	address: string;
}

`Page`

Отображает основную страницу магазина: список товаров и корзину. Является корневым визуальным компонентом. Наследуется от `Component`.

interface IPage {
	counter: number;
	catalog: HTMLElement[];
	locked: boolean;
}

`Card`

Представляет собой UI-компонент товарной карточки с данными о товаре и кнопкой действия. Расширяет интерфейс `IProductItem`.


interface ICard extends IProductItem {
	count?: string;
	buttonText?: string;
}

`Basket`

Компонент для отображения содержимого корзины, подсчёта суммы заказа и визуализации добавленных товаров. Наследуется от `Component`.

interface IBasketView {
	items: HTMLElement[];
	total: number;
}

`Modal`

Компонент модального окна, отображающий произвольный HTML-контент. Используется для предпросмотра и подтверждений.


interface IModalData {
	content: HTMLElement;
}

`Success`

Отвечает за отображение информации об успешной покупке. Выводит итоговую сумму заказа. Наследуется от `Component`.


interface ISuccess {
	total: number | null;
}

---

Типы данных

export type ApiPostMethods = 'POST' | 'PUT' | 'DELETE';

export interface ApiListResponse<T> {
	total: number;
	items: T[];
}

export type EventName = string | RegExp;
export type Subscriber = (...args: any[]) => void;
export interface EmitterEvent {
	eventName: string;
	data: unknown;
}

export interface IProductItem {
	id: string;
	title: string;
	description?: string;
	image?: string;
	category: string;
	price: number | null;
}

export interface IAppState {
	catalog: IProductItem[];
	basket: IProductItem[];
	preview: string | null;
	contact: IContactsForm | null;
	delivery: IDeliveryForm | null;
	order: IOrderForm | null;
}

export interface IContactsForm {
	email: string;
	phone: string;
}

export interface IDeliveryForm {
	payment: string;
	address: string;
}

export interface IOrderForm extends IContactsForm, IDeliveryForm {}

export interface IOrderData extends IOrderForm {
	items: string[];
	total: number;
}

export interface IOrderResult {
	id: string;
	total: number;
}

export interface IPage {
	counter: number;
	catalog: HTMLElement[];
	locked: boolean;
}

export interface ICard extends IProductItem {
	count?: string;
	buttonText?: string;
}

export interface ISuccess {
	total: number | null;
}

export interface IBasketView {
	items: HTMLElement[];
	total: number;
}

export interface IFormState {
	valid: boolean;
	errors: string[];
}

export type FormErrors = Partial<Record<keyof IOrderForm, string>>;

export interface IModalData {
	content: HTMLElement;
}

export interface ILarekAPI {
	getCardList(): Promise<ICard[]>;
	orderItems(order: IOrderForm): Promise<IOrderResult>;
}

export interface IActions {
	onClick(event: MouseEvent): void;
}

export interface ISuccessActions {
	onClick(): void;
}
