import { h, live } from '../../core/dom.js';
import { AHead, numField, patchItem, table } from './shared.js';
export const pricesPage = store => live(store, s => h('div', {}, AHead('Admin · Prices', 'Prices'),
  h('p', { class: 'soft' }, 'Leave blank to show “Ask for price”. Rooms, safaris, events and catering are quoted per request, so they have no list price.'),
  table(['Item', 'Price (KSh)'], [
    ...s.items.map(i => h('tr', {}, h('td', {}, i.name), h('td', {}, numField(i.price, v => patchItem(store, i.id, { price: v }), 'Price for ' + i.name)))),])));
