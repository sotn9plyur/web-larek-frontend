# Проектная работа "Веб-ларек"

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

Проектная работа "Веб-ларек"
Архитектура проекта
Проект построен по архитектурному паттерну MVP:

Model — отвечает за хранение и управление данными (классы Model и AppState);

View — представляет пользовательский интерфейс (классы Card, Component, Order, Form, Basket, Page);

Presenter — обеспечивает связь между моделью и представлением.

Принципы взаимодействия
Коммуникация между компонентами реализована через событийную модель. Компоненты инициируют события, а подписчики обрабатывают их, передают данные, выполняют вычисления и обновляют состояние моделей. Это обеспечивает слабую связанность компонентов и расширяемость проекта.

Пользовательские события
Связь между моделью и представлением осуществляется через EventEmitter, реализующий событийную модель. Ниже приведён перечень ключевых пользовательских событий, используемых в проекте:

Событие	Назначение
catalog:changed	Каталог обновлён
preview:changed	Товар выбран для предпросмотра
basket:changed	Содержимое корзины изменено
basket:cleared	Корзина очищена
basket:item-added	Товар добавлен в корзину
basket:item-removed	Товар удалён из корзины
order:submit	Отправка формы заказа
order:completed	Заказ успешно оформлен
order:failed	Ошибка при оформлении заказа
form:address-changed	Изменён адрес доставки
form:contacts-changed	Изменены контактные данные
form:validation-error	Ошибка валидации формы
modal:open	Открытие модального окна
modal:close	Закрытие модального окна

Ключевые компоненты
EventEmitter
Класс реализует брокер событий, обеспечивая подписку и обработку событий в приложении.

Конструктор
Создает хранилище для подписчиков событий.

Методы:

on(event, handler) — подписка на событие;

off(event, handler) — отписка от события;

onAll(handler) — подписка на все события;

offAll() — отписка от всех событий;

emit(event, data) — генерация события;

trigger(event, callback) — установка триггера-события.

API
Обеспечивает взаимодействие с серверной частью.

Конструктор:

baseUrl: string — базовый URL сервера;

options: RequestInit — настройки запроса.

Методы:

get(endpoint) — выполнение GET-запроса;

post(endpoint, data) — выполнение POST-запроса;

handleResponse(response) — обработка ответа и ошибок.

Model
Универсальный класс модели данных. Поддерживает генерацию событий при изменении состояния.

Конструктор:

data: Partial<T> — данные модели;

events: IEvents — объект для взаимодействия через события.

Метод:

emitChanges(event, data) — оповещение о изменениях.

AppState
Центральная модель, управляющая данными каталога, корзиной, заказом и валидацией.

Методы:

setCatalog(data) — установка списка товаров;

setPreview(productId) — установка товара для предпросмотра;

addToBasket(productId) — добавление в корзину;

removeToBasket(productId) — удаление из корзины;

clearBasket() — очистка корзины;

validateAddress(data) — валидация адреса;

validateContacts(data) — валидация контактов;

getTotal() — расчет общей стоимости заказа.

Компоненты View
Component
Базовый UI-компонент для работы с DOM.

Конструктор:

container: HTMLElement — контейнер компонента.

Методы:

toggleClass(name, force) — добавление/удаление класса;

setImage(src, alt) — установка изображения;

setVisible() / setHidden() — управление видимостью;

setDisabled(flag) — управление доступностью;

render(data?) — отрисовка содержимого.

Card
Представляет карточку товара.

Наследует: Component.

Сеттеры и геттеры:
id, title, category, image, description, price, button, index.

Конструктор:

container: HTMLElement — контейнер карточки;

actions?: ICardActions — объект с обработчиками событий.

Form
Универсальный компонент формы, обрабатывает валидацию и ошибки.

Наследует: Component.

Конструктор:

container: HTMLFormElement;

events: IEvents.

Методы:

onInputChange() — обработка изменений;

set valid — установка валидности;

set errors — вывод ошибок;

render() — перерисовка формы.

Order
Расширяет Form, содержит поля оплаты и контактной информации.

Конструктор:

container: HTMLElement;

events: IEvents.

Методы:

select paymentMethod — выбор метода оплаты;

set address, phone, email — заполнение данных.

Basket
Компонент отображения корзины.

Наследует: Component.

Конструктор:

container: HTMLElement;

events: EventEmitter.

Сеттеры:

item — установка элементов;

selected — управление отображением наличия;

total — отображение общей суммы.

Page
Компонент главной страницы, управляет отображением каталога и корзины.

Наследует: Component.

Конструктор:

container: HTMLElement;

events: IEvents.

Сеттеры:

catalog — отрисовка карточек;

counter — счетчик товаров в корзине;

locked — блокировка прокрутки.

Modal
Отвечает за отображение модального окна.

Наследует: Component.

Конструктор:

container: HTMLElement;

events: IEvents.

Методы:

open() / close() — управление видимостью;

set content — установка содержимого;

render() — отрисовка модального окна.

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
