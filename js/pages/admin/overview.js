import { h, live } from '../../core/dom.js';
import { KIND } from '../../services/contact.js';
import { remote } from '../../services/backend.js';
import { countUp } from '../../core/motion.js';
import { AHead, statusChip, table } from './shared.js';
const stat = (l, n, hint) => h('div', { class: 'stat' }, h('span', { class: 'label' }, l), h('p', { class: 'n' }, n), h('p', { class: 'soft small' }, hint));
let counted = false;
export const overviewPage = store => live(store, s => {
  const count = st => s.requests.filter(r => r.status === st).length;
  const low = s.items.filter(i => i.stock != null && i.stock <= 3);
  const priced = s.items.filter(i => i.sec !== 'bar');
  const checks = [
    ['Connect Supabase so changes reach every visitor', remote, '#/admin/settings'],
    ['Set a guide price for every room', s.rooms.length > 0 && s.rooms.every(r => r.price), '#/admin/rooms'],
    ['Price every menu item', priced.every(i => i.price != null), '#/admin/items'],
    ['Add your own photos to the gallery', s.gallery.some(g => /^(https?:|data:)/.test(g.src)), '#/admin/gallery'],
  ];
  const done = checks.filter(c => c[1]).length;
  const page = h('div', {}, AHead('Admin · Overview', 'Overview', h('p', { class: 'soft small' }, new Date().toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' }))),
    h('div', { class: 'stats' }, stat('New requests', count('New'), 'Waiting for a reply'), stat('Quoted', count('Quoted'), 'Waiting for the guest'),
      stat('Confirmed', count('Confirmed'), 'Booked in'), stat('Low or sold out', low.length, 'Items at 3 or fewer')),
    done < checks.length && h('div', { class: 'setup' }, h('div', { class: 'a-sub' }, h('h2', {}, 'Finish setting up'), h('span', { class: 'soft small' }, `${done} of ${checks.length} done`)),
      h('div', { class: 'bar' }, h('i', { style: `width:${(done / checks.length) * 100}%` })),
      h('ul', {}, checks.map(([t, ok, to]) => h('li', { class: ok ? 'ok' : '' }, h('span', { class: 'cb', 'aria-hidden': 'true' }, ok ? '✓' : ''), ok ? h('span', {}, t) : h('a', { href: to }, t))))),
    h('div', { class: 'a-grid' },
      h('div', {}, h('div', { class: 'a-sub' }, h('h2', {}, 'Latest requests'), h('a', { href: '#/admin/requests' }, 'Open inbox →')),
        s.requests.length ? table(['Guest', 'Request', 'Status'], s.requests.slice(0, 5).map(r => h('tr', {}, h('td', {}, h('strong', {}, r.name), h('div', { class: 'soft small' }, r.phone)), h('td', {}, KIND[r.kind], h('div', { class: 'soft small' }, r.title)), h('td', {}, statusChip(r.status)))))
          : h('p', { class: 'empty' }, 'No requests yet. They appear here when guests send a quote request, order or enquiry.')),
      h('div', {}, h('div', { class: 'a-sub' }, h('h2', {}, 'Stock to watch'), h('a', { href: '#/admin/items' }, 'Menu items →')),
        low.length ? table(['Item', 'Left'], low.map(i => h('tr', {}, h('td', {}, i.name), h('td', {}, i.stock)))) : h('p', { class: 'empty' }, 'Nothing low. Set stock on a menu item to track it.'))));
  if (!counted) { counted = true; page.querySelectorAll('.stat .n').forEach(n => countUp(n)); }
  return page;
});
