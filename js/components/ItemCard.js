import { h } from '../core/dom.js';
import { money } from '../services/contact.js';
import { Photo } from './Blocks.js';
import { Qty } from './Qty.js';
// Catalogue card (used for the bar). Everything else on the menu is a price row.
export const ItemCard = store => i =>
  h('article', { class: 'card' }, Photo(i.img, i.name, { cls: 'square' }),
    h('div', { class: 'card-b' },
      h('div', { class: 'row-between' }, h('h3', {}, i.name),
        i.stock === 0 ? h('span', { class: 'tag amber' }, 'Sold out') : i.stock > 0 && i.stock <= 3 ? h('span', { class: 'tag amber' }, `Only ${i.stock} left`) : null),
      h('p', { class: 'soft small' }, money(i.price)), Qty(store, i)));
