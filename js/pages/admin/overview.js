import { h, live } from '../../core/dom.js';
import { countUp } from '../../core/motion.js';
import { SEED } from '../../data/seed.js';
import { KIND } from '../../services/contact.js';
import { AHead, statusChip, stockChip, table } from './shared.js';
const stat = (l, n, hint) => h('div', { class: 'stat' }, h('span', { class: 'label' }, l), h('p', { class: 'n' }, n), h('p', { class: 'soft small' }, hint));
let counted = false; // count-up plays once per visit, not on every edit
export const overviewPage = store => live(store, s => {
  const low = s.items.filter(i => i.stock != null && i.stock <= 3);
  const count = st => s.requests.filter(r => r.status === st).length;
  const page = h('div', {}, AHead('Admin · Overview', 'Overview', h('p', { class: 'soft small' }, new Date().toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' }))),
    h('div', { class: 'stats' }, stat('New requests', count('New'), 'Waiting for a reply'), stat('Quoted', count('Quoted'), 'Waiting for the guest'),
      stat('Confirmed', count('Confirmed'), 'Booked in'), stat('Low or sold out', low.length, 'Items at 3 or fewer')),
    h('div', { class: 'a-grid' },
      h('div', {}, h('div', { class: 'a-sub' }, h('h2', {}, 'Latest requests'), h('a', { href: '#/admin/requests' }, 'All requests →')),
        s.requests.length ? table(['Guest', 'Request', 'Status'], s.requests.slice(0, 5).map(r =>
          h('tr', {}, h('td', {}, h('strong', {}, r.name), h('div', { class: 'soft small' }, r.phone)), h('td', {}, KIND[r.kind], h('div', { class: 'soft small' }, r.title)), h('td', {}, statusChip(r.status)))))
          : h('p', { class: 'empty' }, 'No requests yet. Quote requests and cart orders appear here when guests send them.')),
      h('div', {}, h('div', { class: 'a-sub' }, h('h2', {}, 'Stock to watch'), h('a', { href: '#/admin/stock' }, 'Manage stock →')),
        low.length ? table(['Item', 'Left', ''], low.map(i => h('tr', {}, h('td', {}, i.name), h('td', {}, i.stock), h('td', {}, stockChip(i.stock)))))
          : h('p', { class: 'empty' }, 'Nothing low. Set stock on the Stock tab to track an item.'))),
    h('div', { class: 'danger' }, h('span', { class: 'soft small' }, 'Data is saved in this browser only.'),
      h('button', { class: 'btn sm', type: 'button', onClick: () => confirm('Reset all stock, prices and bookings?') && store.set(structuredClone(SEED)) }, 'Reset demo data')));
  if (!counted) { counted = true; page.querySelectorAll('.stat .n').forEach(n => countUp(n)); }
  return page;
});
