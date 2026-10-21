import { h, toast } from '../core/dom.js';
import { bookingText } from '../services/contact.js';
import { SendButtons } from './SendButtons.js';
export function BookingForm(store) {
  const box = h('div');
  const today = new Date().toISOString().slice(0, 10);
  const show = b => box.replaceChildren(h('div', { class: 'panel' },
    h('h2', { style: 'margin:0' }, 'Request saved'),
    h('p', { class: 'muted' }, 'Send it to the resort now. Choose how:'),
    SendButtons('Booking request', bookingText(b))));
  const form = h('form', { class: 'f', onSubmit: e => {
    e.preventDefault();
    const f = Object.fromEntries(new FormData(e.target));
    if (f.checkOut <= f.checkIn) return toast('Check-out must be after check-in');
    const b = { id: 'b' + Date.now(), status: 'New', created: new Date().toISOString(), ...f };
    store.set(s => ({ bookings: [b, ...s.bookings] }));
    show(b);
  } },
    h('h2', { style: 'margin:0' }, 'Book a room'),
    h('label', {}, 'Room', h('select', { name: 'room', required: true }, store.get().rooms.map(r => h('option', {}, r.name)))),
    h('div', { class: 'two' },
      h('label', {}, 'Check-in', h('input', { type: 'date', name: 'checkIn', min: today, required: true })),
      h('label', {}, 'Check-out', h('input', { type: 'date', name: 'checkOut', min: today, required: true }))),
    h('div', { class: 'two' },
      h('label', {}, 'Your name', h('input', { name: 'name', autocomplete: 'name', required: true })),
      h('label', {}, 'Phone', h('input', { name: 'phone', type: 'tel', autocomplete: 'tel', required: true }))),
    h('label', {}, 'Guests', h('input', { name: 'guests', type: 'number', min: 1, value: 2, required: true })),
    h('button', { class: 'btn', type: 'submit' }, 'Continue'));
  box.append(form);
  return box;
}
