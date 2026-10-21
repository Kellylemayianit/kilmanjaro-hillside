import { h, live } from '../../core/dom.js';
import { AHead, numField, patchItem, patchRoom, table } from './shared.js';
export const pricesPage = store => live(store, s => h('div', {}, AHead('Admin · Prices', 'Prices'),
  h('p', { class: 'soft' }, 'Leave blank to show “Ask for price” on the site.'),
  table(['Item / room', 'Price (KSh)'], [
    ...s.items.map(i => h('tr', {}, h('td', {}, i.name), h('td', {}, numField(i.price, v => patchItem(store, i.id, { price: v }), 'Price for ' + i.name)))),
    ...s.rooms.map(r => h('tr', {}, h('td', {}, r.name + ' (per night)'), h('td', {}, numField(r.price, v => patchRoom(store, r.id, { price: v }), 'Price for ' + r.name))))])));
