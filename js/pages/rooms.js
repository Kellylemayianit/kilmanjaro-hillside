import { h, live } from '../core/dom.js';
import { money } from '../services/contact.js';
import { BookingForm } from '../components/BookingForm.js';
export const roomsPage = store => h('section', {},
  h('h1', {}, 'Rooms'), h('p', { class: 'muted' }, 'Pick a room, choose your dates, and send your request in a minute.'),
  live(store, s => h('div', { class: 'grid' }, s.rooms.map(r => h('article', { class: 'card' },
    h('img', { src: `assets/img/${r.img}`, alt: r.name }),
    h('div', { class: 'card-b' }, h('h3', {}, r.name), h('p', { class: 'muted' }, r.desc), h('strong', {}, money(r.price) + (r.price ? ' / night' : '')))))) ),
  h('div', { style: 'margin-top:28px' }, BookingForm(store)));
