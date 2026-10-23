import { h, icon, toast } from '../../core/dom.js';
import { CONFIG as C } from '../../config.js';
import { KIND, CHANNELS, replyTemplates, guestDest, intl } from '../../services/contact.js';
import { remote } from '../../services/backend.js';
import { refreshRequests, updateRequest, removeRequest } from '../../services/requests.js';
import { AHead, chip, statusChip, numField, ago } from './shared.js';
const STATUS = ['New', 'Quoted', 'Confirmed', 'Cancelled'];
const CH_ICON = { whatsapp: 'whatsapp', sms: 'sms', email: 'mail' };
const AFTER = { quote: 'Quoted', confirm: 'Confirmed', decline: 'Cancelled' }; // sending these templates moves the request on
const last = r => r.thread?.[r.thread.length - 1]?.at || r.created;
// Inbox: every quote request, order and enquiry is a conversation. Reply on WhatsApp, SMS or email, or call; each message you send is logged here.
export function requestsPage(store) {
  const st = { filter: 'All', q: '', sel: null, draft: '', tpl: null, thread: false };
  const box = h('div', { class: 'inbox-wrap' });
  const err = e => toast(e?.message || 'Something went wrong');
  const patch = (r, p) => updateRequest(store, r.id, p).catch(err);
  const bubble = m => h('div', { class: 'bub ' + m.dir }, h('div', { class: 'bub-t' }, m.text), h('small', {}, m.dir === 'in' ? 'Guest request' : `You · ${m.channel}`, ' · ', ago(m.at)));
  const send = (r, c) => {
    const text = st.draft.trim(); if (!text) return toast('Write a message first');
    const entry = { at: new Date().toISOString(), dir: 'out', channel: CHANNELS[c].label, text };
    const p = { thread: [...r.thread, entry] }; if (AFTER[st.tpl] && r.status !== AFTER[st.tpl]) p.status = AFTER[st.tpl];
    patch(r, p); st.draft = ''; st.tpl = null; setTimeout(draw, 60);
  };
  const chBtn = (r, c) => {
    const dest = guestDest(r), ok = !!dest[c], ch = CHANNELS[c];
    const a = h('a', { class: 'btn' + (c === store.get().prefs.contact ? ' wa' : ''), href: '#', ...(ch.ext ? { target: '_blank', rel: 'noopener' } : {}), 'aria-disabled': !ok, title: ok ? '' : 'No email on this request',
      onClick: e => { if (!ok) return e.preventDefault(); if (!st.draft.trim()) { e.preventDefault(); return toast('Write a message first'); } a.href = ch.href(dest[c], st.draft, `Kilimanjaro Hillside: ${r.title}`); send(r, c); } }, icon(CH_ICON[c], 18), ch.label);
    return a;
  };
  const thread = r => {
    const what = `${KIND[r.kind]} · ${r.title}`;
    const compose = h('textarea', { id: 'compose', rows: 4, placeholder: 'Type your reply, or pick a quick reply above', onInput: e => (st.draft = e.target.value) }, st.draft);
    return h('section', { class: 'convo', 'aria-label': 'Conversation' },
      h('div', { class: 'cv-head' }, h('button', { class: 'btn sm cv-back', type: 'button', onClick: () => { st.thread = false; draw(); } }, '← All requests'),
        h('div', {}, h('h2', {}, r.name), h('p', { class: 'soft small' }, what, ' · ', h('a', { href: `tel:+${intl(r.phone)}` }, r.phone), r.email ? ` · ${r.email}` : '')),
        h('div', { class: 'cv-ctl' }, h('div', { class: 'field' }, h('label', { for: 'st' }, 'Status'), h('select', { id: 'st', onChange: e => patch(r, { status: e.target.value }).then?.(() => draw()) }, STATUS.map(o => h('option', { selected: o === r.status }, o)))),
          r.kind !== 'order' && h('div', { class: 'field' }, h('label', {}, 'Quote (KSh)'), numField(r.quote, v => { patch(r, { quote: v }); }, 'Quote amount')))),
      h('details', { class: 'cv-details' }, h('summary', {}, 'Request details'), h('dl', { class: 'dl' }, r.details.map(([k, v]) => h('div', { class: 'dl-row' }, h('dt', { class: 'label' }, k), h('dd', {}, v))),
        r.message && h('div', { class: 'dl-row' }, h('dt', { class: 'label' }, 'Message'), h('dd', {}, r.message)))),
      h('div', { class: 'cv-thread', tabindex: '0', 'aria-label': 'Messages' }, (r.thread.length ? r.thread : [{ at: r.created, dir: 'in', channel: 'form', text: r.message || r.title }]).map(bubble)),
      h('div', { class: 'composer' }, h('div', { class: 'quick', role: 'group', 'aria-label': 'Quick replies' }, replyTemplates(r).map(([k, l, t]) =>
        h('button', { class: 'chip-btn sm' + (st.tpl === k ? ' on' : ''), type: 'button', onClick: () => { st.draft = t; st.tpl = k; compose.value = t; compose.focus(); } }, l))),
        compose,
        h('div', { class: 'send-row' }, h('span', { class: 'label' }, 'Send with'), chBtn(r, 'whatsapp'), chBtn(r, 'sms'), chBtn(r, 'email'),
          h('a', { class: 'btn', href: `tel:+${intl(r.phone)}` }, icon('phone', 18), 'Call')),
        h('p', { class: 'soft small' }, 'Tapping a channel opens that app with your message ready and logs it here. Replies from the guest arrive in that app.')),
      h('div', { class: 'cv-foot' }, h('button', { class: 'btn sm quiet', type: 'button', onClick: () => { if (confirm('Delete this request?')) { removeRequest(store, r.id).catch(err); st.sel = null; st.thread = false; draw(); } } }, icon('trash', 16), 'Delete request')));
  };
  const draw = () => {
    const all = [...store.get().requests].sort((a, b) => new Date(last(b)) - new Date(last(a)));
    const list = all.filter(r => (st.filter === 'All' || r.status === st.filter) && (!st.q || (r.name + r.phone + r.title).toLowerCase().includes(st.q.toLowerCase())));
    const cur = all.find(r => r.id === st.sel);
    const item = r => h('li', {}, h('button', { class: 'req' + (cur?.id === r.id ? ' on' : '') + (r.status === 'New' ? ' new' : ''), type: 'button', onClick: () => { st.sel = r.id; st.thread = true; st.draft = ''; st.tpl = null; draw(); } },
      h('span', { class: 'rq-top' }, h('strong', {}, r.name), h('small', {}, ago(last(r)))), h('span', { class: 'rq-mid' }, chip(KIND[r.kind]), h('span', { class: 'small' }, r.title)), statusChip(r.status)));
    box.replaceChildren(AHead('Admin · Inbox', 'Requests', h('button', { class: 'btn sm', type: 'button', onClick: () => refreshRequests(store).then(() => { draw(); toast('Up to date'); }).catch(err) }, 'Refresh')),
      h('div', { class: 'inbox' + (st.thread && cur ? ' show-thread' : '') },
        h('div', { class: 'rq-list' }, h('div', { class: 'tabs', role: 'tablist' }, ['All', ...STATUS].map(f => h('button', { class: 'tab' + (st.filter === f ? ' on' : ''), type: 'button', role: 'tab', 'aria-selected': st.filter === f,
          onClick: () => { st.filter = f; draw(); } }, f + (f === 'All' ? '' : ` (${all.filter(r => r.status === f).length})`)))),
          list.length ? h('ul', {}, list.map(item)) : h('p', { class: 'empty' }, all.length ? 'No requests with this status.' : 'No requests yet. Quote requests, orders and enquiries appear here as soon as a guest sends one.')),
        cur ? thread(cur) : h('section', { class: 'convo placeholder' }, h('p', { class: 'empty' }, 'Select a request to read the conversation and reply.'))));
  };
  draw();
  if (remote) { refreshRequests(store).then(draw).catch(err); const iv = setInterval(() => (box.isConnected ? refreshRequests(store).then(() => !box.contains(document.activeElement) && draw()).catch(() => {}) : clearInterval(iv)), 30000); }
  return box;
}
