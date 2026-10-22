import { h, icon } from '../core/dom.js';
import { CONFIG as C } from '../config.js';
import { img, Btn } from './Blocks.js';
import { ThemeSwitch } from './ThemeSwitch.js';
export const LINKS = [['home', 'Home'], ['story', 'Our story'], ['menu', 'Menu'], ['drinks', 'Drinks'], ['rooms', 'Rooms'], ['gallery', 'Gallery'], ['contact', 'Contact']];
const list = cls => h('ul', { class: cls }, LINKS.map(([k, l]) => h('li', {}, h('a', { href: `#/${k}`, 'data-k': k }, l))));
// Sticky header + left-hand drawer on small screens.
export function Header() {
  const setDrawer = open => {
    drawer.classList.toggle('open', open); scrim.classList.toggle('open', open);
    document.body.classList.toggle('lock', open); burger.setAttribute('aria-expanded', open);
  };
  const burger = h('button', { class: 'burger', type: 'button', 'aria-label': 'Open menu', 'aria-controls': 'drawer', 'aria-expanded': 'false', onClick: () => setDrawer(true) }, icon('menu'), h('span', {}, 'Menu'));
  const brand = h('a', { class: 'wordmark', href: '#/home', 'aria-label': C.NAME }, h('img', { src: img('logo.png'), alt: '' }));
  const header = h('header', { class: 'site-header' }, h('div', { class: 'wrap nav-inner' }, brand,
    h('nav', { class: 'primary-nav', 'aria-label': 'Main' }, list('')),
    h('div', { class: 'nav-right' }, ThemeSwitch({ compact: true }), Btn('Book a room', { href: '#/rooms', kind: 'solid hide-sm' }), burger)));
  const scrim = h('div', { class: 'scrim', onClick: () => setDrawer(false) });
  const drawer = h('aside', { id: 'drawer', class: 'drawer', 'aria-label': 'Menu' },
    h('div', { class: 'drawer-head' }, h('img', { src: img('logo.png'), alt: C.NAME }),
      h('button', { class: 'drawer-close', type: 'button', 'aria-label': 'Close menu', onClick: () => setDrawer(false) }, icon('close'))),
    list('drawer-list'), h('div', { class: 'drawer-foot' }, ThemeSwitch(), Btn('Book a room', { href: '#/rooms', kind: 'solid' })));
  addEventListener('keydown', e => e.key === 'Escape' && setDrawer(false));
  const root = h('div', {}, header, scrim, drawer);
  root.setActive = k => {
    root.querySelectorAll('a[data-k]').forEach(a => { const on = a.dataset.k === k; on ? a.setAttribute('aria-current', 'page') : a.removeAttribute('aria-current'); });
    header.classList.toggle('scrolled', scrollY > 8); setDrawer(false);
  };
  addEventListener('scroll', () => header.classList.toggle('scrolled', scrollY > 8), { passive: true });
  return root;
}
