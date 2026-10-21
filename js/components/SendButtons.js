import { h } from '../core/dom.js';
import { waLink, smsLink, mailLink } from '../services/contact.js';
// The three ways to move a booking along: Email, WhatsApp, SMS.
export const SendButtons = (subject, text) =>
  h('div', { class: 'row' },
    h('a', { class: 'btn sm', href: mailLink(subject, text) }, 'Email'),
    h('a', { class: 'btn sm wa', href: waLink(text), target: '_blank', rel: 'noopener' }, 'WhatsApp'),
    h('a', { class: 'btn sm alt', href: smsLink(text) }, 'SMS'));
