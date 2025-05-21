Проектная работа "Веб-ларек"

Стек: HTML, SCSS, TS, Webpack

Структура проекта:
- src/ — исходные файлы проекта
- src/components/ — папка с JS компонентами
- src/components/base/ — папка с базовым кодом

Важные файлы:
- src/pages/index.html — HTML-файл главной страницы
- src/types/index.ts — файл с типами
- src/index.ts — точка входа приложения
- src/scss/styles.scss — корневой файл стилей
- src/utils/constants.ts — файл с константами
- src/utils/utils.ts — файл с утилитами

## Установка и запуск
Для установки и запуска проекта необходимо выполнить команды

```
npm install
npm run start
```

или

```
yarn
yarn start
```
## Сборка

```
npm run build
```

или

```
yarn build
```


Архитектура проекта
Проект построен на паттерне MVP:

Model — отвечает за данные и их изменение: хранение, получение, обновление, удаление

View — отображает интерфейс, реагирует на действия пользователя

Presenter — связывает Model и View, управляет логикой и обработкой событий

Об архитектуре и взаимодействии
Основой взаимодействия компонентов служит событийная модель
Model инициирует события, Presenter (главный управляющий) — слушает их, обрабатывает данные и передает их во View, а также в обратную сторону — от View к Model через Presenter

Базовые классы и структура
EventEmitter
Брокер событий, позволяющий подписываться и инициировать события

Методы:

on(event, callback) — подписка на событие;

off(event, callback) — отписка от события;

onAll(callback) — подписка на все события;

offAll(callback) — снятие подписки со всех событий;

emit(event, data) — вызов события с передачей данных;

trigger(event, callback) — устанавливает callback, создающий событие

API
Базовый класс для работы с сервером

Конструктор:

baseUrl: string

options: RequestInit = {}

Методы:

get(endpoint: string) — GET-запрос;

post(endpoint: string, data: any) — POST-запрос;

handleResponse(response) — обработка ответа сервера с учетом ошибок

Model<T>
Управляет данными и взаимодействует с EventEmitter

Конструктор:

data: Partial<T>

events: IEvents

Методы:

emitChanges(eventName: string, data?: any) — инициирует событие об изменении модели

AppState extends Model<IAppState>
Центральное хранилище состояния

Методы:

setCatalog(catalog: IProduct[])

setPreview(productId: string)

addToBasket(productId: string)

removeFromBasket(productId: string)

clearBasket()

validateAddress(address: string): boolean

validateContacts(email: string, phone: string): boolean

getTotal(): number

Компоненты интерфейса (View)
Component
Базовый UI-класс

Конструктор:

container: HTMLElement

Методы:

toggleClass(className: string, force?: boolean)

setImage(src: string, alt: string)

setVisible(), setHidden()

setDisabled(isDisabled: boolean)

render(data?: Partial<T>)

Card extends Component
Карточка товара

Конструктор:

container: HTMLElement

actions?: ICardActions

Сеттеры/геттеры:

id, category, title, description, price, image, button, index

Form extends Component
Общая форма (наследуется Order)

Конструктор:

container: HTMLFormElement

events: IEvents

Методы:

onInputChange(event: InputEvent)

set valid: boolean

set errors: Record<string, string>

render()

Order extends Form
Форма оформления заказа

Методы:

select paymentMethod(payment: TPayment)

set address(string)

set phone(string)

set email(string)

Basket extends Component
Отображает корзину

Конструктор:

container: HTMLElement

events: EventEmitter

Методы:

set item(IProduct)

set selected(boolean)

set total(number)

Page extends Component
Работает с главной страницей

Конструктор:

container: HTMLElement

events: IEvents

Методы:

set catalog(IProduct[])

set counter(number)

set locked(boolean)

Modal extends Component
Модальное окно

Конструктор:

container: HTMLElement

events: IEvents

Методы:

open()

close()

set content(HTMLElement)

render()

Типы данных
ts
Копировать
Редактировать
export type TProductCategory = 'софт-скил' | 'другое' | 'дополнительное' | 'кнопка' | 'хард-скил';
export type TPayment = 'онлайн' | 'при получении';

export interface IProduct {
  id: string;
  category: TProductCategory;
  title: string;
  description: string;
  price: number | null;
  image?: string;
}

export interface IProductOrder {
  item: IProduct;
  total: number;
}

export interface IOrderForm {
  payment: TPayment;
  address: string;
  email: string;
  phone: string;
}

export interface IBasket {
  item: IProduct;
  price: number;
  total: number;
}

export interface IOrderSuccess {
  id: string;
  total: number;
}

export interface IAppState {
  catalog: IProduct[];
  basket: string[];
  preview: string | null;
  order: IOrderForm | null;
}
