import { h, toast } from '../../core/dom.js';
// Small admin helpers shared by the dashboard pages.
export const chip = (t, kind = '') => h('span', { class: 'chip ' + kind }, t);
export const statusChip = s => chip(s, { New: 'rust', Confirmed: 'teal', Cancelled: 'muted' }[s]);
export const stockChip = n => (n === 0 ? chip('Sold out', 'rust') : n > 0 && n <= 3 ? chip('Low', 'amber') : n > 0 ? chip('In stock', 'teal') : chip('Not tracked', 'muted'));
export const num = v => (v === '' ? null : Math.max(0, +v));
export const numField = (value, onChange, label) =>
  h('input', { class: 'num', type: 'number', min: 0, value: value ?? '', placeholder: '–', 'aria-label': label, onChange: e => { onChange(num(e.target.value)); toast('Saved'); } });
export const table = (head, rows, cols) =>
  h('div', { class: 'tbl scroll' }, h('table', {}, h('thead', {}, h('tr', {}, head.map(t => h('th', { scope: 'col' }, t)))), h('tbody', {}, rows)));
export const patchItem = (store, id, p) => store.set(s => ({ items: s.items.map(x => (x.id === id ? { ...x, ...p } : x)) }));
export const patchRoom = (store, id, p) => store.set(s => ({ rooms: s.rooms.map(x => (x.id === id ? { ...x, ...p } : x)) }));
export const patchBooking = (store, id, p) => store.set(s => ({ bookings: s.bookings.map(x => (x.id === id ? { ...x, ...p } : x)) }));
export const AHead = (label, title, right) => h('div', { class: 'a-head' }, h('div', {}, h('span', { class: 'label' }, label), h('h1', { class: 'i' }, title)), right);
