import { h } from '../core/dom.js';
import { CONFIG as C } from '../config.js';
import { waLink, smsLink, mailLink } from '../services/contact.js';
export const contactPage = () => h('section', {},
  h('h1', {}, 'Contact & location'), h('p', { class: 'muted' }, C.LOCATION),
  h('div', { class: 'row' },
    h('a', { class: 'btn', href: `tel:+${C.PHONE_INTL}` }, 'Call ' + C.PHONE),
    h('a', { class: 'btn wa', href: waLink('Hello!'), target: '_blank', rel: 'noopener' }, 'WhatsApp'),
    h('a', { class: 'btn alt', href: smsLink('Hello!') }, 'SMS'),
    h('a', { class: 'btn alt', href: mailLink('Enquiry', 'Hello,') }, 'Email'),
    h('a', { class: 'btn alt', href: C.MAP, target: '_blank', rel: 'noopener' }, 'Open in Google Maps')));
