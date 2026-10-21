import { h, live } from '../../core/dom.js';
import { AHead, numField, patchItem, stockChip, table } from './shared.js';
export const stockPage = store => live(store, s => h('div', {}, AHead('Admin · Stock', 'Stock'),
  h('p', { class: 'soft' }, 'Leave blank = not tracked. 0 shows “Sold out” on the site. 3 or fewer shows “Only n left”.'),
  table(['Item', 'Section', 'In stock', 'Status'], s.items.map(i => h('tr', {}, h('td', {}, i.name), h('td', { class: 'soft' }, i.cat),
    h('td', {}, numField(i.stock, v => patchItem(store, i.id, { stock: v }), 'Stock for ' + i.name)), h('td', {}, stockChip(i.stock)))))));
