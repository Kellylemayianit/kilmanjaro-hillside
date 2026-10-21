import { h } from '../core/dom.js';
import { CONFIG } from '../config.js';
import { ThemeToggle } from './ThemeToggle.js';
const LINKS = [['home', 'Home'], ['story', 'Our story'], ['menu', 'Menu'], ['drinks', 'Drinks'], ['rooms', 'Rooms'], ['gallery', 'Gallery'], ['contact', 'Contact'], ['admin', 'Admin']];
export const Sidebar = () =>
  h('aside', { id: 'side', class: 'side' },
    h('div', { class: 'brand' }, h('img', { src: 'assets/img/17.jpg', alt: '' }),
      h('div', {}, h('strong', {}, CONFIG.NAME), h('small', {}, 'Kimana, Kajiado'))),
    h('nav', { 'aria-label': 'Main' }, LINKS.map(([k, l]) => h('a', { href: `#/${k}`, 'data-k': k }, l))),
    ThemeToggle());
export const markActive = k =>
  document.querySelectorAll('#side nav a').forEach(a => {
    const on = a.dataset.k === k;
    a.classList.toggle('on', on);
    on ? a.setAttribute('aria-current', 'page') : a.removeAttribute('aria-current');
  });
