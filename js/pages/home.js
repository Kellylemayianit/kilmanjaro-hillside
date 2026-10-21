import { h } from '../core/dom.js';
import { CONFIG } from '../config.js';
import { waLink } from '../services/contact.js';
export const homePage = () => h('section', {},
  h('div', { class: 'hero' },
    h('div', {}, h('h1', {}, 'Eat, rest and unwind at the foot of Kilimanjaro'),
      h('p', {}, 'Nyama choma, cold drinks and quiet rooms in Kimana. What would you like to do today?'),
      h('div', { class: 'row' },
        h('a', { class: 'btn', href: waLink('Hello, I would like to order.'), target: '_blank', rel: 'noopener' }, 'Order on WhatsApp'),
        h('a', { class: 'btn alt', style: 'color:#fff;border-color:rgba(255,255,255,.4)', href: '#/rooms' }, 'See rooms'))),
    h('img', { src: 'assets/img/11.jpg', alt: 'Covered lounge with sofas and a garden view' })),
  h('h2', {}, 'Start here'),
  h('div', { class: 'grid' },
    [['menu', 'Eat', 'Nyama choma, fish and Kenyan plates'], ['rooms', 'Stay', 'Simple, colourful rooms near Amboseli'], ['drinks', 'Drinks & events', 'Bar, lounge and garden for gatherings']]
      .map(([k, t, s]) => h('a', { class: 'choice', href: `#/${k}` }, h('strong', {}, t), h('span', {}, s)))),
  h('p', { class: 'muted', style: 'margin-top:28px' }, `${CONFIG.LOCATION} · `, h('a', { href: '#/contact' }, 'Find us')));
