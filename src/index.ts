import './scss/styles.scss';

import { LarekAPI } from './components/LarekAPI';
import { API_URL, CDN_URL } from './utils/constants';
import { EventEmitter } from './components/base/events';
import { AppState, CatalogChangeEvent } from './components/AppData';
import { Page } from './components/Page';
import { cloneTemplate, ensureElement } from './utils/utils';
import { Modal, Success } from './components/common/Modal';
import { Basket } from './components/common/Basket';
import { IDeliveryForm, IContactsForm, ICard } from './types';
import { DeliveryForm, ContactsForm, PaymentMethod } from './components/Order';
import { Card } from './components/Card';

const events = new EventEmitter();
const api = new LarekAPI(CDN_URL, API_URL);

events.onAll(({ eventName, data }) => {
    console.log(eventName, data);
});

const cardCatalogTemplate = ensureElement<HTMLTemplateElement>('#card-catalog');
const cardPreviewTemplate = ensureElement<HTMLTemplateElement>('#card-preview');
const cardBasketTemplate = ensureElement<HTMLTemplateElement>('#card-basket');
const basketTemplate = ensureElement<HTMLTemplateElement>('#basket');
const deliveryTemplate = ensureElement<HTMLTemplateElement>('#order');
const contactsTemplate = ensureElement<HTMLTemplateElement>('#contacts');
const orderTemplate = ensureElement<HTMLTemplateElement>('#success');

const appData = new AppState({}, events);

const page = new Page(document.body, events);
const modal = new Modal(ensureElement<HTMLElement>('#modal-container'), events);

const basket = new Basket(cloneTemplate(basketTemplate), events);
const delivery = new DeliveryForm(cloneTemplate(deliveryTemplate), events, {
    onClick: (event: Event) => {
        events.emit('payment:changed', event.target);
    },
});
const contacts = new ContactsForm(cloneTemplate(contactsTemplate), events);

events.on<CatalogChangeEvent>('items:changed', () => {
    page.catalog = appData.catalog.map((item) => {
        const card = new Card(cloneTemplate(cardCatalogTemplate), {
            onClick: () => events.emit('card:select', item),
        });
        return card.render({
            title: item.title,
            image: item.image,
            category: item.category,
            price: item.price,
        });
    });
});

events.on('basket:open', () => {
    modal.render({
        content: basket.render({}),
    });
});

events.on('card:select', (item: ICard) => {
    appData.setPreview(item);
});

events.on('preview:changed', (item: ICard) => {
    const card = new Card(cloneTemplate(cardPreviewTemplate), {
        onClick: () => {
            events.emit('item:check', item);
            card.buttonText =
                appData.basket.indexOf(item) === -1 ? 'В корзину' : 'Убрать из корзины';
        },
    });

    modal.render({
        content: card.render({
            category: item.category,
            title: item.title,
            image: item.image,
            description: item.description,
            price: item.price,
            buttonText:
                appData.basket.indexOf(item) === -1 ? 'В корзину' : 'Убрать из корзины',
        }),
    });
});

events.on('item:add', (item: ICard) => {
    appData.addToBasket(item);
});

events.on('item:remove', (item: ICard) => {
    appData.removeFromBasket(item);
});

events.on('item:check', (item: ICard) => {
    appData.basket.indexOf(item) === -1
        ? events.emit('item:add', item)
        : events.emit('item:remove', item);
});

events.on('basket:changed', (items: ICard[]) => {
    basket.items = items.map((item, count) => {
        const card = new Card(cloneTemplate(cardBasketTemplate), {
            onClick: () => {
                events.emit('item:remove', item);
            },
        });
        return card.render({
            title: item.title,
            price: item.price,
            count: (count + 1).toString(),
        });
    });

    basket.total = appData.getTotal();
});

events.on('count:changed', () => {
    page.counter = appData.basket.length;
});

events.on('order:open', () => {
    modal.render({
        content: delivery.render({
            payment: '',
            address: '',
            valid: false,
            errors: [],
        }),
    });
});

events.on('payment:changed', (target: HTMLElement) => {
    if (!target.classList.contains('button_alt-active')) {
        delivery.changePayment();
        appData.order.payment = PaymentMethod[target.getAttribute('name') ?? ''];
    }
});

events.on(
    /^order\..*:change/,
    (data: { field: keyof IDeliveryForm; value: string }) => {
        appData.setDelivery(data.field, data.value);
    }
);

events.on('deliveryForm:changed', (errors: Partial<IDeliveryForm>) => {
    const { payment, address } = errors;
    delivery.valid = !payment && !address;
    delivery.errors = Object.values({ payment, address })
        .filter((i) => !!i)
        .join('; ');
});

events.on('delivery:ready', () => {
    delivery.valid = true;
});

events.on('order:submit', () => {
    modal.render({
        content: contacts.render({
            email: '',
            phone: '',
            valid: false,
            errors: [],
        }),
    });
});

events.on(
    /^contacts\..*:change/,
    (data: { field: keyof IContactsForm; value: string }) => {
        appData.setContacts(data.field, data.value);
    }
);

events.on('contacts:changed', (errors: Partial<IContactsForm>) => {
    const { email, phone } = errors;
    contacts.valid = !email && !phone;
    contacts.errors = Object.values({ email, phone })
        .filter((i) => !!i)
        .join('; ');
});

events.on('contacts:ready', () => {
    contacts.valid = true;
});

events.on('modal:open', () => {
    page.locked = true;
});

events.on('modal:close', () => {
    page.locked = false;
});

interface OrderResult {
    total: number;
}

events.on('contacts:submit', handleOrderSubmit);

function handleOrderSubmit() {
    api
        .orderItems(appData.getOrderData())
        .then(handleOrderSuccess)
        .catch((error) => {
            console.error('Ошибка:', error);
        });
}

function handleOrderSuccess(result: OrderResult) {
    const successComponent = new Success(cloneTemplate(orderTemplate), {
        onClick: handleSuccessClick,
    });

    successComponent.total = result.total.toString();

    modal.render({
        content: successComponent.render({}),
    });

    appData.clearBasket();
}

function handleSuccessClick() {
    modal.close();
}

api
    .getCardList()
    .then(appData.setCatalog.bind(appData))
    .catch((error) => {
        console.error('Ошибка:', error);
    });