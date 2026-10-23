import { h, icon } from '../core/dom.js';
import { CONFIG as C } from '../config.js';
import { img } from './Blocks.js';
import { modal } from './Modal.js';
const seen = () => { try { return !!localStorage.getItem('khr-seen'); } catch { return true; } };
const mark = () => { try { localStorage.setItem('khr-seen', '1'); } catch {} };
const INTENT = [['menu', 'Eat & drink', 'Menu, group orders and the bar', 'fork'], ['rooms', 'Stay', 'See rooms and get a quote', 'bed'], ['services', 'Safaris & events', 'Safaris, events, outside catering', 'photos']];
const REACH = [['whatsapp', 'WhatsApp', 'Fastest for orders and quotes', 'whatsapp', 'Recommended'], ['sms', 'SMS', 'Works without data', 'sms'], ['email', 'Email', 'Best for longer enquiries', 'mail']];
const LABEL = { menu: 'Eat & drink', rooms: 'Stay', services: 'Safaris & events', whatsapp: 'WhatsApp', sms: 'SMS', email: 'Email' };
// Welcome -> what brings you -> how to reach you -> summary. Tapping an option moves on by itself, and each pick is saved at once.
export function openOnboarding(store) {
  const p = store.get().prefs, st = { step: 0, intent: p.intent || null, contact: p.contact || 'whatsapp' };
  const body = h('div', { class: 'ob' });
  let m;
  const save = () => store.set(s => ({ prefs: { ...s.prefs, contact: st.contact, intent: st.intent } }));
  const go = n => { st.step = n; draw(); };
  const finish = to => { mark(); save(); m.close(); if (to) location.hash = `#/${to}`; };
  const pick = (list, key, then) => h('div', { class: 'choices', role: 'radiogroup' }, list.map(([k, t, s, ic, tag]) =>
    h('button', { class: 'choice' + (st[key] === k ? ' on' : ''), type: 'button', role: 'radio', 'aria-checked': st[key] === k, onClick: () => { st[key] = k; save(); draw(); setTimeout(then, 280); } },
      h('span', { class: 'c-ic' }, icon(ic, 22)), h('span', { class: 'c-tx' }, tag && h('em', {}, tag), h('strong', {}, t), h('small', {}, s)), h('i', { class: 'dot' }))));
  const top = () => h('div', { class: 'ob-top' }, h('ol', { class: 'ob-steps', 'aria-label': 'Progress' }, ['Welcome', 'Your visit', 'Contact', 'Ready'].map((t, n) =>
    h('li', { class: n < st.step ? 'done' : n === st.step ? 'on' : '', 'aria-current': n === st.step ? 'step' : null }, h('span', {}, n < st.step ? '✓' : n + 1), h('b', {}, t)))),
    st.step < 3 && h('button', { class: 'link', type: 'button', onClick: () => finish() }, 'Skip'));
  const back = to => h('button', { class: 'btn quiet', type: 'button', onClick: () => go(to) }, '← Back');
  const row = (k, v, to) => h('div', { class: 'sum-row' }, h('span', { class: 'label' }, k), h('strong', {}, LABEL[v]), h('button', { class: 'link', type: 'button', onClick: () => go(to) }, 'Change'));
  const draw = () => {
    if (st.step === 0) body.replaceChildren(h('img', { class: 'ob-bg', src: img('hero.jpg'), alt: '' }), h('div', { class: 'ob-scrim' }),
      h('div', { class: 'ob-copy' }, h('span', { class: 'hero-chip' }, 'Kimana · Lormeuti'), h('h2', { tabindex: '-1' }, `Welcome to ${C.SHORT}`),
        h('p', {}, 'Two quick questions so we can show you what you need. It takes about ten seconds.'),
        h('div', { class: 'ob-actions' }, h('button', { class: 'btn solid', type: 'button', onClick: () => { mark(); go(1); } }, 'Begin'), h('button', { class: 'btn ghost', type: 'button', onClick: () => finish() }, 'Just browse'))));
    else if (st.step === 1) body.replaceChildren(top(), h('div', { class: 'ob-card' }, h('h2', { class: 'i', tabindex: '-1' }, 'What brings you here?'), h('p', { class: 'soft' }, 'Tap one. You can explore everything else afterwards.'), pick(INTENT, 'intent', () => go(2)), h('div', { class: 'row-actions' }, back(0))));
    else if (st.step === 2) body.replaceChildren(top(), h('div', { class: 'ob-card' }, h('h2', { class: 'i', tabindex: '-1' }, 'How should we reach you?'), h('p', { class: 'soft' }, 'Your orders and quote requests will open in this app, ready to send.'), pick(REACH, 'contact', () => go(3)), h('div', { class: 'row-actions' }, back(1))));
    else body.replaceChildren(top(), h('div', { class: 'ob-card ob-done' }, h('div', { class: 'tick' }, icon('check', 30)), h('h2', { class: 'i', tabindex: '-1' }, 'You’re all set'),
      h('div', { class: 'sum' }, row('Interested in', st.intent, 1), row('Reach you by', st.contact, 2)),
      h('div', { class: 'stack' }, h('button', { class: 'btn solid', type: 'button', onClick: () => finish(st.intent) }, `Take me to ${LABEL[st.intent]}`), h('button', { class: 'btn quiet', type: 'button', onClick: () => finish() }, 'Stay on the home page')),
      h('p', { class: 'soft small' }, 'Change this any time from “Welcome tour” in the footer.')));
    body.querySelector('h2[tabindex]')?.focus({ preventScroll: true });
  };
  draw();
  m = modal(body, { cls: 'full', label: 'Welcome' });
  m.el.addEventListener('close', mark);
  return m;
}
export const maybeOnboard = store => { if (!seen()) setTimeout(() => openOnboarding(store), 600); };
