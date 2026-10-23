import { h } from '../../core/dom.js';
// Small admin helpers shared by the dashboard pages.
export const chip = (t, kind = '') => h('span', { class: 'chip ' + kind }, t);
export const statusChip = s => chip(s, { New: 'rust', Quoted: 'amber', Confirmed: 'teal', Cancelled: 'muted' }[s]);
export const stockChip = n => (n === 0 ? chip('Sold out', 'rust') : n > 0 && n <= 3 ? chip('Low', 'amber') : chip('', 'hidden'));
export const num = v => (v === '' ? null : Math.max(0, +v));
export const numField = (value, onChange, label) =>
  h('input', { class: 'num', type: 'number', min: 0, value: value ?? '', placeholder: '–', 'aria-label': label, onChange: e => onChange(num(e.target.value)) });
export const textField = (value, onChange, label, o = {}) =>
  h('input', { class: 'txt', type: 'text', value: value ?? '', placeholder: o.ph || '', 'aria-label': label, list: o.list, onChange: e => onChange(e.target.value.trim()) });
export const table = (head, rows) =>
  h('div', { class: 'tbl scroll' }, h('table', {}, h('thead', {}, h('tr', {}, head.map(t => h('th', { scope: 'col' }, t)))), h('tbody', {}, rows)));
export const AHead = (label, title, right) => h('div', { class: 'a-head' }, h('div', {}, h('span', { class: 'label' }, label), h('h1', { class: 'i' }, title)), right);
export const ago = iso => {
  const m = Math.round((Date.now() - new Date(iso)) / 60000);
  return m < 1 ? 'now' : m < 60 ? `${m}m` : m < 1440 ? `${Math.round(m / 60)}h` : new Date(iso).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' });
};
