import { h } from '../core/dom.js';
import { waLink, money } from '../services/contact.js';
export const ItemCard = i =>
  h('article', { class: 'card' },
    h('img', { src: `assets/img/${i.img}`, alt: i.name, loading: 'lazy' }),
    h('div', { class: 'card-b' },
      h('h3', {}, i.name),
      h('p', { class: 'muted' }, money(i.price)),
      i.stock === 0 ? h('span', { class: 'tag' }, 'Sold out')
        : [i.stock > 0 && i.stock <= 3 ? h('span', { class: 'tag' }, `Only ${i.stock} left`) : null,
           h('a', { class: 'btn', href: waLink(`Hello, I would like to order: ${i.name}`), target: '_blank', rel: 'noopener' }, 'Order on WhatsApp')]));
