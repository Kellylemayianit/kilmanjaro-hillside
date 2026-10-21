import { h, toast } from '../core/dom.js';
import { CONFIG } from '../config.js';
import { bookingText } from '../services/contact.js';
import { SendButtons } from '../components/SendButtons.js';
import { SEED } from '../data/seed.js';
const num = v => (v === '' ? null : Math.max(0, +v));
export function adminPage(store) {
  const st = { tab: 'stock', ok: sessionStorage.getItem('khr-admin') === '1' };
  const box = h('section');
  const draw = () => box.replaceChildren(h('h1', {}, 'Admin'), st.ok ? panel() : login());
  const login = () => h('form', { class: 'f', onSubmit: e => {
    e.preventDefault();
    if (new FormData(e.target).get('pin') === CONFIG.ADMIN_PIN) { sessionStorage.setItem('khr-admin', '1'); st.ok = true; draw(); }
    else toast('Wrong PIN');
  } }, h('label', {}, 'Admin PIN', h('input', { name: 'pin', type: 'password', inputmode: 'numeric', autocomplete: 'off', required: true })), h('button', { class: 'btn', type: 'submit' }, 'Sign in'));
  const field = (value, onChange, label) => h('input', { type: 'number', min: 0, value: value ?? '', placeholder: '–', 'aria-label': label, onChange: e => { onChange(num(e.target.value)); toast('Saved'); } });
  const patchItem = (id, p) => store.set(s => ({ items: s.items.map(x => (x.id === id ? { ...x, ...p } : x)) }));
  const patchRoom = (id, p) => store.set(s => ({ rooms: s.rooms.map(x => (x.id === id ? { ...x, ...p } : x)) }));
  const table = (head, rows) => h('div', { class: 'scroll' }, h('table', {}, h('thead', {}, h('tr', {}, head.map(t => h('th', {}, t)))), h('tbody', {}, rows)));
  const tabs = () => h('div', { class: 'tabs', role: 'tablist' }, [['stock', 'Stock'], ['prices', 'Prices'], ['bookings', 'Bookings']]
    .map(([k, l]) => h('button', { class: 'btn' + (st.tab === k ? ' on' : ''), role: 'tab', 'aria-selected': st.tab === k, onClick: () => { st.tab = k; draw(); } }, l)));
  const panel = () => {
    const s = store.get();
    let body;
    if (st.tab === 'stock') body = [h('p', { class: 'muted' }, 'Leave blank = not tracked. 0 = shows "Sold out" on the site.'),
      table(['Item', 'In stock'], s.items.map(i => h('tr', {}, h('td', {}, i.name), h('td', {}, field(i.stock, v => patchItem(i.id, { stock: v }), 'Stock for ' + i.name)))))];
    else if (st.tab === 'prices') body = table(['Item / room', 'Price (KSh)'], [
      ...s.items.map(i => h('tr', {}, h('td', {}, i.name), h('td', {}, field(i.price, v => patchItem(i.id, { price: v }), 'Price for ' + i.name)))),
      ...s.rooms.map(r => h('tr', {}, h('td', {}, r.name + ' (per night)'), h('td', {}, field(r.price, v => patchRoom(r.id, { price: v }), 'Price for ' + r.name))))]);
    else body = s.bookings.length ? s.bookings.map(b => h('div', { class: 'panel' },
      h('strong', {}, `${b.name} · ${b.room}`), h('span', { class: 'muted' }, `${b.checkIn} → ${b.checkOut} · ${b.guests} guest(s) · ${b.phone}`),
      h('div', { class: 'row' },
        h('select', { 'aria-label': 'Status', style: 'width:auto', onChange: e => store.set(x => ({ bookings: x.bookings.map(y => (y.id === b.id ? { ...y, status: e.target.value } : y)) })) },
          ['New', 'Confirmed', 'Cancelled'].map(o => h('option', { selected: o === b.status }, o))),
        h('button', { class: 'btn sm alt', onClick: () => { if (confirm('Delete this booking?')) { store.set(x => ({ bookings: x.bookings.filter(y => y.id !== b.id) })); draw(); } } }, 'Delete')),
      SendButtons('Booking ' + b.status, bookingText(b)))) : h('p', { class: 'muted' }, 'No booking requests yet.');
    return [tabs(), body, h('div', { class: 'row', style: 'margin-top:20px' },
      h('button', { class: 'btn sm alt', onClick: () => { sessionStorage.removeItem('khr-admin'); st.ok = false; draw(); } }, 'Sign out'),
      h('button', { class: 'btn sm alt', onClick: () => { if (confirm('Reset all stock, prices and bookings?')) { store.set(structuredClone(SEED)); draw(); } } }, 'Reset data'))];
  };
  draw();
  return box;
}
