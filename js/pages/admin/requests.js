import { h } from '../../core/dom.js';
import { KIND, replyText, guestDest, money } from '../../services/contact.js';
import { Handoff } from '../../components/Handoff.js';
import { AHead, chip, statusChip, patchRequest, numField, table } from './shared.js';
const STATUS = ['New', 'Quoted', 'Confirmed', 'Cancelled'];
// Quote requests (room, safari, event, catering) and cart orders, in one list.
export function requestsPage(store) {
  const st = { filter: 'All', sel: null };
  const box = h('div');
  const row = (k, v) => h('div', { class: 'dl-row' }, h('dt', { class: 'label' }, k), h('dd', {}, v));
  const detail = r => h('aside', { class: 'panel' }, h('span', { class: 'label' }, 'Selected request'), h('h3', {}, r.name),
    h('dl', { class: 'dl' }, row('Service', KIND[r.kind]), row('Request', r.title), r.details.map(([k, v]) => row(k, v)), row('Phone', r.phone), r.email && row('Email', r.email),
      r.message && row('Message', r.message), r.sentVia && row('Sent via', r.sentVia)),
    r.kind !== 'order' && h('div', { class: 'field' }, h('label', {}, 'Your quote (KSh)'), numField(r.quote, v => patchRequest(store, r.id, { quote: v }), 'Quote amount')),
    h('div', { class: 'field' }, h('label', { for: 'st' }, 'Status'),
      h('select', { id: 'st', onChange: e => patchRequest(store, r.id, { status: e.target.value }) }, STATUS.map(o => h('option', { selected: o === r.status }, o)))),
    h('span', { class: 'label gap' }, 'Reply to guest'),
    Handoff(store, { text: replyText(r), subject: `Kilimanjaro Hillside: your ${KIND[r.kind].toLowerCase()} (${r.status})`, dest: guestDest(r) }),
    h('button', { class: 'btn sm quiet', type: 'button', onClick: () => { if (confirm('Delete this request?')) { store.set(x => ({ requests: x.requests.filter(y => y.id !== r.id) })); st.sel = null; } } }, 'Delete request'));
  const draw = () => {
    const all = store.get().requests, list = all.filter(r => st.filter === 'All' || r.status === st.filter), cur = all.find(r => r.id === st.sel) || list[0];
    box.replaceChildren(AHead('Admin · Requests', 'Requests'),
      h('div', { class: 'tabs', role: 'tablist' }, ['All', ...STATUS].map(f => h('button', { class: 'tab' + (st.filter === f ? ' on' : ''), type: 'button', role: 'tab', 'aria-selected': st.filter === f,
        onClick: () => { st.filter = f; st.sel = null; draw(); } }, f + (f === 'All' ? '' : ` (${all.filter(r => r.status === f).length})`)))),
      all.length ? h('div', { class: 'a-grid book' },
        table(['Guest', 'Request', 'Status'], list.map(r => h('tr', { class: 'pick' + (cur && r.id === cur.id ? ' on' : '') },
          h('td', {}, h('button', { class: 'row-btn', type: 'button', onClick: () => { st.sel = r.id; draw(); } }, h('strong', {}, r.name), h('span', { class: 'soft small' }, r.phone))),
          h('td', {}, chip(KIND[r.kind]), h('div', { class: 'small' }, r.title)), h('td', {}, statusChip(r.status))))),
        cur ? detail(cur) : h('p', { class: 'empty' }, 'No requests with this status.'))
        : h('p', { class: 'empty' }, 'No requests yet. Quote requests and orders appear here as soon as a guest sends one.'));
  };
  draw();
  const off = store.subscribe(() => (box.isConnected ? draw() : off()));
  return box;
}
