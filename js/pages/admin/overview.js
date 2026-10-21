import { h, live } from '../../core/dom.js';
import { countUp } from '../../core/motion.js';
import { SEED } from '../../data/seed.js';
import { fmtRange } from '../../services/contact.js';
import { AHead, statusChip, stockChip, table } from './shared.js';
const stat = (l, n, hint) => h('div', { class: 'stat' }, h('span', { class: 'label' }, l), h('p', { class: 'n' }, n), h('p', { class: 'soft small' }, hint));
let counted = false; // count-up plays once per visit, not on every edit
export const overviewPage = store => live(store, s => {
  const low = s.items.filter(i => i.stock != null && i.stock <= 3);
  const count = st => s.bookings.filter(b => b.status === st).length;
  const page = h('div', {}, AHead('Admin · Overview', 'Overview', h('p', { class: 'soft small' }, new Date().toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' }))),
    h('div', { class: 'stats' }, stat('New requests', count('New'), 'Waiting for a reply'), stat('Confirmed', count('Confirmed'), 'Bookings'),
      stat('Low stock', s.items.filter(i => i.stock > 0 && i.stock <= 3).length, '3 or fewer left'), stat('Sold out', s.items.filter(i => i.stock === 0).length, 'Hidden from ordering')),
    h('div', { class: 'a-grid' },
      h('div', {}, h('div', { class: 'a-sub' }, h('h2', {}, 'Latest requests'), h('a', { href: '#/admin/bookings' }, 'All bookings →')),
        s.bookings.length ? table(['Guest', 'Room', 'Dates', 'Status'], s.bookings.slice(0, 5).map(b =>
          h('tr', {}, h('td', {}, h('strong', {}, b.name), h('div', { class: 'soft small' }, b.phone)), h('td', {}, b.room), h('td', {}, fmtRange(b.checkIn, b.checkOut)), h('td', {}, statusChip(b.status)))))
          : h('p', { class: 'empty' }, 'No booking requests yet. They appear here when guests send one from the Rooms page.')),
      h('div', {}, h('div', { class: 'a-sub' }, h('h2', {}, 'Stock to watch'), h('a', { href: '#/admin/stock' }, 'Manage stock →')),
        low.length ? table(['Item', 'Left', ''], low.map(i => h('tr', {}, h('td', {}, i.name), h('td', {}, i.stock), h('td', {}, stockChip(i.stock)))))
          : h('p', { class: 'empty' }, 'Nothing low. Set stock on the Stock tab to track an item.'))),
    h('div', { class: 'danger' }, h('span', { class: 'soft small' }, 'Data is saved in this browser only.'),
      h('button', { class: 'btn sm', type: 'button', onClick: () => confirm('Reset all stock, prices and bookings?') && store.set(structuredClone(SEED)) }, 'Reset demo data')));
  if (!counted) { counted = true; page.querySelectorAll('.stat .n').forEach(n => countUp(n)); }
  return page;
});
