import { h, icon, toast } from '../core/dom.js';
import { CHANNELS, RESORT } from '../services/contact.js';
// The offload step: show the message, let the visitor choose WhatsApp / SMS / Email, then confirm "one tap left".
// dest = { whatsapp, sms, email } recipient per channel (default: the resort). Channels with no recipient are hidden.
export function Handoff(store, { text, subject = 'Enquiry', dest = RESORT, onSent, extra }) {
  const box = h('div', { class: 'handoff' });
  const pref = store.get().prefs.contact;
  const avail = Object.keys(CHANNELS).filter(c => dest[c]);
  const order = [pref, ...avail.filter(c => c !== pref)].filter(c => avail.includes(c));
  const link = (c, kind, label) => {
    const ch = CHANNELS[c];
    return h('a', { class: 'btn ' + kind, href: ch.href(dest[c], text, subject), ...(ch.ext ? { target: '_blank', rel: 'noopener' } : {}),
      onClick: () => setTimeout(() => { onSent?.(c); sent(c); }, 350) }, label || ch.label);
  };
  const copy = () => navigator.clipboard?.writeText(text).then(() => toast('Message copied'), () => toast('Copy not available'));
  const choose = () => box.replaceChildren(
    h('span', { class: 'label' }, 'Your message'), h('p', { class: 'bubble' }, text),
    h('span', { class: 'label' }, 'Send it with'),
    h('div', { class: 'stack' }, order.map((c, n) => link(c, n === 0 ? (c === 'whatsapp' ? 'wa' : 'solid') : '', n === 0 && order.length > 1 ? `${CHANNELS[c].label} · your choice` : null)),
      h('button', { class: 'btn quiet', type: 'button', onClick: copy }, 'Copy message')),
    extra);
  const sent = c => box.replaceChildren(h('div', { class: 'done' },
    h('div', { class: 'tick' }, icon('check', 30)), h('span', { class: 'label' }, 'One tap left'),
    h('h3', {}, `Press send in ${CHANNELS[c].label}`), h('p', { class: 'soft' }, 'Your message is ready there. Nothing is final until it is sent.'),
    h('div', { class: 'stack' }, link(c, c === 'whatsapp' ? 'wa' : 'solid', `Open ${CHANNELS[c].label} again`),
      h('button', { class: 'btn', type: 'button', onClick: choose }, 'Send another way')), extra));
  choose();
  return box;
}
