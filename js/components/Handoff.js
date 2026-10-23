import { h, icon, toast } from '../core/dom.js';
import { CONFIG as C } from '../config.js';
import { CHANNELS, RESORT } from '../services/contact.js';
// The offload step, in three clear stages: Choose (edit message + pick an app) -> Send (we ask "did it send?") -> Done.
// dest = recipient per channel (default: the resort). Channels without a recipient are hidden.
const HINT = { whatsapp: 'Opens WhatsApp with your message ready', sms: 'Opens your messages app', email: 'Opens your email app' };
const ICON = { whatsapp: 'whatsapp', sms: 'sms', email: 'mail' };
let uid = 0;
export function Handoff(store, { text, subject = 'Enquiry', dest = RESORT, callTo = C.PHONE_INTL, onSent, extra, next }) {
  const st = { phase: 'choose', ch: null, msg: text }, id = 'hm' + ++uid, box = h('div', { class: 'handoff' });
  const pref = store.get().prefs.contact, avail = Object.keys(CHANNELS).filter(c => dest[c]);
  const order = [pref, ...avail.filter(c => c !== pref)].filter(c => avail.includes(c));
  const href = c => CHANNELS[c].href(dest[c], st.msg, subject), tgt = c => (CHANNELS[c].ext ? { target: '_blank', rel: 'noopener' } : {});
  const steps = idx => h('ol', { class: 'hsteps', 'aria-label': 'Progress' }, ['Choose', 'Send', 'Done'].map((t, n) =>
    h('li', { class: n < idx ? 'done' : n === idx ? 'on' : '', 'aria-current': n === idx ? 'step' : null }, h('span', {}, n < idx ? '✓' : n + 1), t)));
  const copy = () => navigator.clipboard?.writeText(st.msg).then(() => toast('Message copied'), () => toast('Copy not available'));
  const tile = (c, n) => {
    const a = h('a', { class: 'tile' + (n === 0 ? ' pref' : ''), href: '#', ...tgt(c), onClick: () => {
      a.href = href(c); st.ch = c; setTimeout(() => { st.phase = 'confirm'; draw(); }, 250); // href is set just before the browser follows it
    } }, icon(ICON[c], 26), h('span', { class: 't-txt' }, h('strong', {}, CHANNELS[c].label, n === 0 && order.length > 1 ? h('em', {}, 'Your choice') : null), h('small', {}, HINT[c])), h('span', { class: 't-go', 'aria-hidden': 'true' }, '→'));
    return a;
  };
  const draw = () => {
    if (st.phase === 'choose') box.replaceChildren(steps(0),
      h('label', { class: 'label', for: id }, 'Your message'),
      h('textarea', { id, class: 'msg', rows: Math.min(10, st.msg.split('\n').length + 1), onInput: e => (st.msg = e.target.value) }, st.msg),
      h('p', { class: 'soft small' }, 'You can edit the message before you send it.'),
      h('span', { class: 'label' }, 'Send it with'), h('div', { class: 'tiles' }, order.map(tile)),
      h('div', { class: 'h-alt' }, h('button', { class: 'btn quiet', type: 'button', onClick: copy }, 'Copy message'), callTo && h('a', { class: 'btn quiet', href: `tel:+${callTo}` }, 'Call instead')), extra);
    else if (st.phase === 'confirm') {
      const L = CHANNELS[st.ch].label;
      box.replaceChildren(steps(1), h('div', { class: 'confirm' }, h('h3', { tabindex: '-1' }, `Did your ${L} message send?`),
        h('p', { class: 'soft' }, `We opened ${L} with your message. Press send there, then come back and tell us.`),
        h('div', { class: 'stack' }, h('button', { class: 'btn solid', type: 'button', onClick: () => { st.phase = 'done'; onSent?.(st.ch); draw(); } }, 'Yes, it’s sent'),
          h('a', { class: 'btn', href: href(st.ch), ...tgt(st.ch) }, `Open ${L} again`), h('button', { class: 'btn quiet', type: 'button', onClick: () => { st.phase = 'choose'; draw(); } }, 'Choose another way')),
        h('p', { class: 'soft small' }, 'Nothing opened? Copy your message and send it yourself.'), h('button', { class: 'btn quiet sm', type: 'button', onClick: copy }, 'Copy message')));
    } else box.replaceChildren(steps(3), h('div', { class: 'done' }, h('div', { class: 'tick' }, icon('check', 30)), h('span', { class: 'label' }, `Sent via ${CHANNELS[st.ch].label}`),
      h('h3', { tabindex: '-1' }, 'Thank you'), h('ul', { class: 'next' }, (next || ['The resort receives your message', 'We reply on the same app to confirm the details', 'Keep your phone nearby']).map((t, n) => h('li', {}, h('span', {}, n + 1), t))), extra));
    box.querySelector('h3[tabindex]')?.focus({ preventScroll: true });
  };
  draw();
  return box;
}
