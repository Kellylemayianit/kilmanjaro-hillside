import { h } from '../core/dom.js';
import { money, orderText } from '../services/contact.js';
import { Photo } from './Blocks.js';
import { modal } from './Modal.js';
import { Handoff } from './Handoff.js';
export const openOrder = (store, i) => modal(h('div', { class: 'sheet-body' },
  h('span', { class: 'label' }, 'Order'), h('h2', {}, i.name), Handoff(store, { text: orderText(i), subject: 'Order: ' + i.name })), { cls: 'sheet', label: 'Order ' + i.name });
export const ItemCard = store => i =>
  h('article', { class: 'card' }, Photo(i.img, i.name, { cls: 'square' }),
    h('div', { class: 'card-b' },
      h('div', { class: 'row-between' }, h('h3', {}, i.name),
        i.stock === 0 ? h('span', { class: 'tag amber' }, 'Sold out') : i.stock > 0 && i.stock <= 3 ? h('span', { class: 'tag amber' }, `Only ${i.stock} left`) : null),
      h('p', { class: 'soft small' }, money(i.price)),
      i.stock === 0 ? h('button', { class: 'btn', type: 'button', disabled: true }, 'Unavailable')
        : h('button', { class: 'btn', type: 'button', onClick: () => openOrder(store, i) }, 'Order on WhatsApp')));
