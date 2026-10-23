import { h, icon } from '../core/dom.js';
import { CONFIG as C } from '../config.js';
import { img } from './Blocks.js';
import { modal } from './Modal.js';
const seen = () => { try { return !!localStorage.getItem('khr-seen'); } catch { return true; } };
const mark = () => { try { localStorage.setItem('khr-seen', '1'); } catch {} };
const INTENT = [['menu', 'Eat & drink', 'Menu, orders and the bar'], ['rooms', 'Stay', 'Get a room quote'], ['services', 'Safaris & events', 'Safaris, events, outside catering']];
const REACH = [['whatsapp', 'WhatsApp', 'Fastest way to confirm a room or order', 'Recommended'], ['sms', 'SMS', 'Works without data'], ['email', 'Email', 'Best for longer enquiries']];
// 3 steps: welcome -> what brings you -> how should we reach you. Saves prefs.contact, which Handoff uses as the first choice.
export function openOnboarding(store) {
  const st = { step: 0, intent: INTENT[1][0], contact: store.get().prefs.contact || 'whatsapp' };
  const body = h('div', { class: 'ob' });
  let m;
  const finish = go => { mark(); store.set(s => ({ prefs: { ...s.prefs, contact: st.contact, intent: st.intent } })); m.close(); if (go) location.hash = `#/${st.intent}`; };
  const pick = (list, key) => h('div', { class: 'choices', role: 'radiogroup' }, list.map(([k, t, s, tag]) =>
    h('button', { class: 'choice' + (st[key] === k ? ' on' : ''), type: 'button', role: 'radio', 'aria-checked': st[key] === k, onClick: () => { st[key] = k; draw(); } },
      h('span', {}, h('span', { class: 'label' }, tag || ''), h('strong', {}, t), h('small', {}, s)), h('i', { class: 'dot' }))));
  const bars = () => h('div', { class: 'steps' }, [0, 1, 2].map(n => h('span', { class: 'pg' + (n <= st.step ? ' on' : '') })));
  const draw = () => {
    if (st.step === 0) body.replaceChildren(h('img', { class: 'ob-bg', src: img('hero.jpg'), alt: '' }), h('div', { class: 'ob-scrim' }), bars(),
      h('div', { class: 'ob-copy' }, h('span', { class: 'hero-chip' }, 'Kimana · Kajiado County'), h('h2', {}, `Welcome to ${C.SHORT}`),
        h('p', {}, 'Nyama choma, cold drinks and quiet rooms. Two quick questions and we will show you around.'),
        h('button', { class: 'btn solid', type: 'button', onClick: () => { st.step = 1; draw(); } }, 'Begin'),
        h('button', { class: 'btn ghost', type: 'button', onClick: () => finish(false) }, 'Just browse')));
    else body.replaceChildren(bars(), h('div', { class: 'ob-card' },
      h('h2', { class: 'i' }, st.step === 1 ? 'What would you like to do today?' : 'How should we reach you?'),
      h('p', { class: 'soft' }, st.step === 1 ? 'Pick one. You can explore the rest afterwards.' : 'Requests are handed to the resort in the app you choose. You can change this later.'),
      st.step === 1 ? pick(INTENT, 'intent') : pick(REACH, 'contact'),
      h('div', { class: 'row-actions' }, h('button', { class: 'btn', type: 'button', onClick: () => { st.step--; draw(); } }, 'Back'),
        h('button', { class: 'btn solid', type: 'button', onClick: () => (st.step === 1 ? (st.step = 2, draw()) : finish(true)) }, st.step === 1 ? 'Continue' : 'Show me around'))));
  };
  draw();
  m = modal(body, { cls: 'full', label: 'Welcome', closable: true });
  m.el.addEventListener('close', mark);
  return m;
}
export const maybeOnboard = store => { if (!seen()) setTimeout(() => openOnboarding(store), 600); };
