import { h } from '../core/dom.js';
import { CONFIG as C } from '../config.js';
import { waLink, enquiryText } from '../services/contact.js';
import { newRequest, submitRequest } from '../services/requests.js';
import { PageHead, Label, Btn, Section } from '../components/Blocks.js';
import { Handoff } from '../components/Handoff.js';
export function contactPage(store) {
  const side = h('div', { class: 'enquire-box' });
  const field = (l, n, a = {}) => h('div', { class: 'field' + (a.full ? ' full' : '') }, h('label', { for: 'c-' + n }, l), a.area ? h('textarea', { id: 'c-' + n, name: n, rows: 4 }) : h('input', { id: 'c-' + n, name: n, ...a }));
  const form = h('form', { class: 'form-grid', onSubmit: async e => {
    e.preventDefault();
    const f = Object.fromEntries(new FormData(e.target));
    await submitRequest(store, newRequest('enquiry', { name: f.name, phone: f.phone, title: 'General enquiry', message: f.message, details: [f.checkIn && ['Dates', `${f.checkIn} to ${f.checkOut || '?'}`]].filter(Boolean) }));
    side.replaceChildren(h('h3', {}, 'Send your enquiry'), Handoff(store, { text: enquiryText(f), subject: 'Enquiry' }));
  } }, field('Name', 'name', { required: true }), field('Phone', 'phone', { type: 'tel', required: true }),
    field('Check-in', 'checkIn', { type: 'date' }), field('Check-out', 'checkOut', { type: 'date' }), field('Message', 'message', { area: true, full: true }),
    h('div', { class: 'full' }, h('button', { class: 'btn solid', type: 'submit' }, 'Continue')));
  side.append(h('h3', {}, 'Send an enquiry'), h('p', {}, 'Tell us your dates and party size. You choose how to send it: WhatsApp, SMS or email.'), form);
  const ext = { target: '_blank', rel: 'noopener' };
  return h('div', { class: 'page' }, PageHead('Plan your stay', 'WhatsApp is the fastest way to reach us. Tap a room or menu item anywhere on the site, or message us directly.'),
    Section('contact-grid reveal', h('div', {}, Label('Contact & reservations'),
      h('ul', { class: 'contact-list' },
        h('li', {}, h('span', { class: 'k' }, 'WhatsApp'), h('a', { class: 'v', href: waLink('Hello!'), ...ext }, C.PHONE_DISPLAY)),
        h('li', {}, h('span', { class: 'k' }, 'Call'), h('a', { class: 'v', href: `tel:+${C.PHONE_INTL}` }, C.PHONE_DISPLAY)),
        h('li', {}, h('span', { class: 'k' }, 'Location'), h('span', { class: 'v' }, C.LOCATION)),
        h('li', {}, h('span', { class: 'k' }, 'Hours'), h('span', { class: 'v' }, C.HOURS)),
        h('li', {}, h('span', { class: 'k' }, 'Follow'), h('a', { class: 'v', href: C.FACEBOOK, ...ext }, 'Facebook'))),
      Btn('Open in Google Maps →', { href: C.MAP, ext: true })), side));
}
