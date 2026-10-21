import { h } from '../../core/dom.js';
import { fmtRange, nights, replyText, guestDest } from '../../services/contact.js';
import { Handoff } from '../../components/Handoff.js';
import { AHead, statusChip, patchBooking, table } from './shared.js';
const STATUS = ['New', 'Confirmed', 'Cancelled'];
export function bookingsPage(store) {
  const st = { filter: 'All', sel: null };
  const box = h('div');
  const row = (k, v) => h('div', { class: 'dl-row' }, h('dt', { class: 'label' }, k), h('dd', {}, v));
  const detail = b => h('aside', { class: 'panel' }, h('span', { class: 'label' }, 'Selected request'), h('h3', {}, b.name),
    h('dl', { class: 'dl' }, row('Room', b.room), row('Dates', `${fmtRange(b.checkIn, b.checkOut)} · ${nights(b.checkIn, b.checkOut)} night(s)`), row('Guests', b.guests), row('Phone', b.phone), b.email && row('Email', b.email),
      b.sentVia && row('Sent via', b.sentVia)),
    h('div', { class: 'field' }, h('label', { for: 'st' }, 'Status'),
      h('select', { id: 'st', onChange: e => patchBooking(store, b.id, { status: e.target.value }) }, STATUS.map(o => h('option', { selected: o === b.status }, o)))),
    h('span', { class: 'label gap' }, 'Reply to guest'),
    Handoff(store, { key: b.id + b.status, text: replyText(b), subject: `Your booking at Kilimanjaro Hillside (${b.status})`, dest: guestDest(b) }),
    h('button', { class: 'btn sm quiet', type: 'button', onClick: () => { if (confirm('Delete this booking?')) { store.set(x => ({ bookings: x.bookings.filter(y => y.id !== b.id) })); st.sel = null; } } }, 'Delete booking'));
  const draw = () => {
    const all = store.get().bookings;
    const list = all.filter(b => st.filter === 'All' || b.status === st.filter);
    const cur = all.find(b => b.id === st.sel) || list[0];
    box.replaceChildren(AHead('Admin · Bookings', 'Bookings'),
      h('div', { class: 'tabs', role: 'tablist' }, ['All', ...STATUS].map(f => h('button', { class: 'tab' + (st.filter === f ? ' on' : ''), type: 'button', role: 'tab', 'aria-selected': st.filter === f,
        onClick: () => { st.filter = f; st.sel = null; draw(); } }, f + (f === 'All' ? '' : ` (${all.filter(b => b.status === f).length})`)))),
      all.length ? h('div', { class: 'a-grid book' },
        table(['Guest', 'Room', 'Dates', 'Status'], list.map(b => h('tr', { class: 'pick' + (cur && b.id === cur.id ? ' on' : '') },
          h('td', {}, h('button', { class: 'row-btn', type: 'button', onClick: () => { st.sel = b.id; draw(); } }, h('strong', {}, b.name), h('span', { class: 'soft small' }, b.phone))),
          h('td', {}, b.room), h('td', {}, fmtRange(b.checkIn, b.checkOut)), h('td', {}, statusChip(b.status))))),
        cur ? detail(cur) : h('p', { class: 'empty' }, 'No bookings with this status.'))
        : h('p', { class: 'empty' }, 'No booking requests yet.'));
  };
  draw();
  // Redraw on store changes (status edits, Handoff sent) while this page is on screen.
  const off = store.subscribe(() => (box.isConnected ? draw() : off()));
  return box;
}
