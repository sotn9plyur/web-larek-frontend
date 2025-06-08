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
Архитектура проекта Архитектура построена по паттерну MVP (Model-View-Presenter):

Model — классы Model и AppState, управляющие данными: получение, обновление и хранение состояния приложения.

View — классы компонентов UI: Card, Component, Order, Form, Basket, Page, которые отвечают за отрисовку и взаимодействие с пользователем.

Presenter — слой посредник между Model и View, осуществляет логику передачи данных и управления состояниями.

Вся коммуникация между компонентами и состоянием происходит через систему событий (EventEmitter). Модель генерирует события, на которые подписываются презентеры и компоненты отображения, обеспечивая реактивное обновление интерфейса.

Основные классы и их функции EventEmitter Брокер событий, позволяющий подписываться, снимать подписки и генерировать события.

Методы: on, off, onAll, offAll, emit, trigger.

API Базовый класс для общения с сервером.

Методы: get, post, handleResponse.

Используется для получения каталога товаров и отправки заказов.

Model Управляет данными и событиями.

Имеет метод emitChanges для оповещения о изменениях данных.

AppState Центральная модель состояния.

Хранит каталог товаров, корзину, предпросмотр, данные заказа и ошибки валидации.

Методы для изменения состояния: setCatalog, setPreview, addToBasket, removeToBasket, clearBasket, validateAddress, validateContacts, getTotal.

Component Базовый UI-компонент.

Методы работы с DOM: toggleClass, setImage, setVisible, setHidden, setDisabled, render.

Card Карточка товара.

Свойства: id, category, title, image, description, price, button, index.

Позволяет отображать товар и реагировать на действия пользователя.

Form Базовый класс для управления формами.

Обрабатывает ввод, валидацию и отображение ошибок.

Order Наследует Form.

Управляет формами оплаты, контактами и адресом.

Basket Управляет отображением и состоянием корзины.

Свойства: item, selected, total.

Page Контролирует главный интерфейс: каталог товаров, счетчик в корзине, блокировку прокрутки.

Modal Отвечает за модальное окно: открытие, закрытие, отображение содержимого.

Типы данных (TypeScript) typescript Копировать Редактировать export type TProductCategory = 'софт-скил' | 'другое' | 'дополнительное' | 'кнопка' | 'хард-скил';

export type TPayment = 'онлайн' | 'при получении';

export interface IProduct { id: string; category: TProductCategory; title: string; description: string; price: number | null; image?: string; }

export interface IProductOrder { item: IProduct; total: number; }

export interface IOrderForm { payment: TPayment; address: string; email: string; phone: string; }

export interface IBasket { item: IProduct; price: number; total: number; }

export interface IOrderSuccess { id: string; total: number; }

export interface IAppState { catalog: IProduct[]; basket: string[]; preview: string | null; order: IOrderForm | null; }