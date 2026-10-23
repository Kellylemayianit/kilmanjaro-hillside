import { h, toast } from '../core/dom.js';
import { requestText } from '../services/contact.js';
import { modal } from './Modal.js';
import { Handoff } from './Handoff.js';
const OCC = ['Birthday', 'Wedding', 'Family gathering', 'Corporate event', 'Other'];
// Each service asks for different details. fields: [name, label, type, options?]
export const QUOTE_KINDS = {
  room: { label: 'Room', title: v => v.room || 'Room stay', fields: s => [['room', 'Room', 'select', s.rooms.map(r => r.name)], ['checkIn', 'Check-in', 'date'], ['checkOut', 'Check-out', 'date'], ['guests', 'Guests', 'number']] },
  safari: { label: 'Safari', title: v => v.interest, fields: () => [['interest', 'Where to', 'select', ['Amboseli National Park', 'Tsavo parks', 'Not sure yet, advise me']], ['date', 'Preferred start date', 'date'], ['days', 'Number of days', 'number'], ['guests', 'Guests', 'number']] },
  event: { label: 'Event hosting', title: v => v.type, fields: () => [['type', 'Type of event', 'select', OCC], ['date', 'Event date', 'date'], ['guests', 'Expected guests', 'number']] },
  catering: { label: 'Outside catering', title: v => v.occasion, fields: () => [['occasion', 'Occasion', 'select', OCC], ['date', 'Date needed', 'date'], ['venue', 'Venue / location', 'text'], ['guests', 'Guests', 'number']] },
};
// Get-a-quote flow: details -> hand off by WhatsApp / SMS / email. Saved to Admin > Requests as New.
export function openQuote(store, kind = 'room', preset = {}) {
  const st = { kind, v: { ...preset } };
  const body = h('div', { class: 'sheet-body' });
  modal(body, { cls: 'sheet wide', label: 'Get a quote' });
  const today = new Date().toISOString().slice(0, 10);
  const input = (n, l, t = 'text', opts, o = {}) => {
    const id = 'q-' + n, val = st.v[n] ?? '';
    if (t === 'select' && !st.v[n]) st.v[n] = opts[0];
    const el = t === 'select' ? h('select', { id, onChange: e => (st.v[n] = e.target.value) }, opts.map(x => h('option', { selected: x === st.v[n] }, x)))
      : t === 'area' ? h('textarea', { id, rows: 3, onInput: e => (st.v[n] = e.target.value) }, val)
      : h('input', { id, type: t, value: val, min: t === 'number' ? 1 : t === 'date' ? today : null, required: o.req, autocomplete: o.ac, onInput: e => (st.v[n] = e.target.value) });
    return h('div', { class: 'field' + (o.full ? ' full' : '') }, h('label', { for: id }, l), el);
  };
  const submit = () => {
    const K = QUOTE_KINDS[st.kind], v = st.v, s = store.get();
    if (st.kind === 'room' && v.checkIn && v.checkOut && v.checkOut <= v.checkIn) return toast('Check-out must be after check-in');
    const r = { id: 'r' + Date.now(), kind: st.kind, status: 'New', created: new Date().toISOString(), name: v.name, phone: v.phone, email: v.email || '',
      title: K.title(v) || K.label, details: K.fields(s).map(([n, l]) => [l, v[n]]).filter(d => d[1]), message: v.message || '' };
    store.set(x => ({ requests: [r, ...x.requests] }));
    body.replaceChildren(h('span', { class: 'label' }, 'Step 2 of 2'), h('h2', {}, 'Send your request'),
      Handoff(store, { text: requestText(r), subject: 'Quote request: ' + r.title,
        onSent: c => store.set(x => ({ requests: x.requests.map(y => (y.id === r.id ? { ...y, sentVia: c } : y)) })) }));
  };
  const draw = () => {
    const K = QUOTE_KINDS[st.kind];
    body.replaceChildren(h('span', { class: 'label' }, 'Step 1 of 2'), h('h2', {}, 'Get a quote'),
      h('p', { class: 'soft', style: 'margin-bottom:1rem' }, 'Prices depend on dates, numbers and what you need. Tell us, and we will send you a quote.'),
      h('form', { class: 'form-grid', onSubmit: e => { e.preventDefault(); submit(); } },
        h('div', { class: 'field full' }, h('label', { for: 'q-kind' }, 'What do you need a quote for?'),
          h('select', { id: 'q-kind', onChange: e => { st.kind = e.target.value; draw(); } }, Object.entries(QUOTE_KINDS).map(([k, x]) => h('option', { value: k, selected: k === st.kind }, x.label)))),
        ...K.fields(store.get()).map(([n, l, t, o]) => input(n, l, t, o, { req: st.kind === 'room' && (n === 'checkIn' || n === 'checkOut') })),
        input('name', 'Your name', 'text', null, { req: true, ac: 'name' }), input('phone', 'Phone', 'tel', null, { req: true, ac: 'tel' }),
        input('email', 'Email (optional)', 'email', null, { full: true, ac: 'email' }), input('message', 'Anything else we should know?', 'area', null, { full: true }),
        h('div', { class: 'full' }, h('button', { class: 'btn solid', type: 'submit' }, 'Continue'))));
  };
  draw();
}
