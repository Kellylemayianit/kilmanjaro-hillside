import { h } from '../core/dom.js';
// First-visit welcome sheet: three big choices, one tap each.
export function Onboarding() {
  try { if (localStorage.getItem('khr-seen')) return null; } catch {}
  const d = h('dialog', { 'aria-label': 'Welcome' });
  const close = () => { try { localStorage.setItem('khr-seen', '1'); } catch {} d.close(); d.remove(); };
  d.append(
    h('h2', { style: 'margin-top:0' }, 'Welcome to Kilimanjaro Hillside'),
    h('p', { class: 'muted' }, 'What would you like to do?'),
    ...[['menu', 'Eat', 'Nyama choma and Kenyan plates'], ['rooms', 'Stay', 'Book a room'], ['drinks', 'Drinks & events', 'Bar, lounge and garden']]
      .map(([k, t, s]) => h('a', { class: 'choice', href: `#/${k}`, onClick: close }, h('strong', {}, t), h('span', {}, s))),
    h('button', { class: 'link', type: 'button', onClick: close }, 'Just browse'));
  setTimeout(() => d.showModal(), 500);
  return d;
}
