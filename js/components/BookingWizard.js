import { h, toast } from '../core/dom.js';
import { bookingText, fmtRange, nights } from '../services/contact.js';
import { Handoff } from './Handoff.js';
// 3 steps: Request -> Review -> Send. The booking is saved (status New) when the visitor confirms on step 2.
export function BookingWizard(store) {
  const today = new Date().toISOString().slice(0, 10);
  const st = { step: 1, d: { room: store.get().rooms[0].name, guests: 2 }, booking: null };
  const box = h('div', { class: 'wizard' });
  const bars = () => h('div', { class: 'steps' }, [1, 2, 3].map(n => h('span', { class: 'pg' + (n <= st.step ? ' on' : '') })));
  const field = (label, name, attrs = {}) => h('div', { class: 'field' }, h('label', { for: 'bk-' + name }, label),
    h('input', { id: 'bk-' + name, name, value: st.d[name] ?? '', ...attrs }));
  const form = () => h('form', { class: 'form-grid', onSubmit: e => {
    e.preventDefault();
    const f = Object.fromEntries(new FormData(e.target));
    if (f.checkOut <= f.checkIn) return toast('Check-out must be after check-in');
    st.d = { ...f, guests: +f.guests }; st.step = 2; draw();
  } },
    h('div', { class: 'field full' }, h('label', { for: 'bk-room' }, 'Room'),
      h('select', { id: 'bk-room', name: 'room' }, store.get().rooms.map(r => h('option', { selected: r.name === st.d.room }, r.name)))),
    field('Check-in', 'checkIn', { type: 'date', min: today, required: true }), field('Check-out', 'checkOut', { type: 'date', min: today, required: true }),
    field('Your name', 'name', { autocomplete: 'name', required: true }), field('Phone', 'phone', { type: 'tel', autocomplete: 'tel', required: true }),
    field('Email (optional)', 'email', { type: 'email', autocomplete: 'email' }), field('Guests', 'guests', { type: 'number', min: 1, required: true }),
    h('div', { class: 'full' }, h('button', { class: 'btn solid', type: 'submit' }, 'Review request')));
  const row = (k, v) => h('div', { class: 'dl-row' }, h('dt', { class: 'label' }, k), h('dd', {}, v));
  const review = () => { const d = st.d; return h('div', {},
    h('dl', { class: 'dl' }, row('Room', d.room), row('Dates', `${fmtRange(d.checkIn, d.checkOut)} · ${nights(d.checkIn, d.checkOut)} night(s)`),
      row('Guests', d.guests), row('Name', d.name), row('Phone', d.phone), d.email && row('Email', d.email)),
    h('p', { class: 'soft small' }, 'Nothing is booked until the resort confirms your dates.'),
    h('div', { class: 'row-actions' }, h('button', { class: 'btn', type: 'button', onClick: () => { st.step = 1; draw(); } }, 'Edit'),
      h('button', { class: 'btn solid', type: 'button', onClick: () => {
        const b = { id: 'b' + Date.now(), status: 'New', created: new Date().toISOString(), ...d };
        st.booking = b; store.set(s => ({ bookings: [b, ...s.bookings] })); st.step = 3; draw();
      } }, 'Save and choose how to send'))); };
  const send = () => Handoff(store, { text: bookingText(st.booking), subject: 'Booking request',
    onSent: c => store.set(s => ({ bookings: s.bookings.map(x => (x.id === st.booking.id ? { ...x, sentVia: c } : x)) })),
    extra: h('button', { class: 'link', type: 'button', onClick: () => { st.step = 1; st.booking = null; draw(); } }, 'Make another request') });
  const titles = ['Book a room', 'Check your request', 'Send it to the resort'];
  const draw = () => box.replaceChildren(bars(), h('span', { class: 'label' }, `Step ${st.step} of 3`), h('h2', { class: 'i' }, titles[st.step - 1]),
    st.step === 1 ? form() : st.step === 2 ? review() : send());
  draw();
  box.pick = name => { st.d.room = name; st.step = 1; draw(); box.scrollIntoView({ behavior: 'smooth', block: 'start' }); };
  return box;
}
