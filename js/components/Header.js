import { h, icon } from '../core/dom.js';
import { CONFIG as C } from '../config.js';
import { img, Btn } from './Blocks.js';
import { ThemeSwitch } from './ThemeSwitch.js';
import { CartButton } from './Cart.js';
import { openQuote } from './QuoteForm.js';
export const LINKS = [['home', 'Home'], ['story', 'Our story'], ['menu', 'Menu'], ['rooms', 'Rooms'], ['services', 'Services'], ['gallery', 'Gallery'], ['contact', 'Contact']];
const list = cls => h('ul', { class: cls }, LINKS.map(([k, l]) => h('li', {}, h('a', { href: `#/${k}`, 'data-k': k }, l))));
// Sticky header (stays on screen while scrolling) + left-hand drawer on small screens.
export function Header(store) {
  const setDrawer = open => {
    drawer.classList.toggle('open', open); scrim.classList.toggle('open', open);
    document.body.classList.toggle('lock', open); burger.setAttribute('aria-expanded', open);
  };
  const quote = () => { setDrawer(false); openQuote(store); };
  const burger = h('button', { class: 'burger', type: 'button', 'aria-label': 'Open menu', 'aria-controls': 'drawer', 'aria-expanded': 'false', onClick: () => setDrawer(true) }, icon('menu'), h('span', {}, 'Menu'));
  const brand = h('a', { class: 'wordmark', href: '#/home', 'aria-label': C.NAME }, h('img', { src: img('logo.png'), alt: '' }));
  const header = h('header', { class: 'site-header' }, h('div', { class: 'wrap nav-inner' }, brand,
    h('nav', { class: 'primary-nav', 'aria-label': 'Main' }, list('')),
    h('div', { class: 'nav-right' }, ThemeSwitch({ compact: true }), CartButton(store), Btn('Get a quote', { kind: 'solid hide-sm', onClick: quote }), burger)));
  const scrim = h('div', { class: 'scrim', onClick: () => setDrawer(false) });
  const drawer = h('aside', { id: 'drawer', class: 'drawer', 'aria-label': 'Menu' },
    h('div', { class: 'drawer-head' }, h('img', { src: img('logo.png'), alt: C.NAME }),
      h('button', { class: 'drawer-close', type: 'button', 'aria-label': 'Close menu', onClick: () => setDrawer(false) }, icon('close'))),
    list('drawer-list'), h('div', { class: 'drawer-foot' }, ThemeSwitch(), Btn('Get a quote', { kind: 'solid', onClick: quote })));
  addEventListener('keydown', e => e.key === 'Escape' && setDrawer(false));
  // display:contents so the sticky header's containing block is the whole page, not this tiny wrapper (that was why it scrolled away)
  const root = h('div', { class: 'head-root' }, header, scrim, drawer);
  root.setActive = k => {
    root.querySelectorAll('a[data-k]').forEach(a => { const on = a.dataset.k === k; on ? a.setAttribute('aria-current', 'page') : a.removeAttribute('aria-current'); });
    header.classList.toggle('scrolled', scrollY > 8); setDrawer(false);
  };
  addEventListener('scroll', () => header.classList.toggle('scrolled', scrollY > 8), { passive: true });
  return root;
}
