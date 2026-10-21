import { h } from '../core/dom.js';
import { CONFIG as C } from '../config.js';
import { waLink, mailLink } from '../services/contact.js';
import { img } from './Blocks.js';
import { ThemeSwitch } from './ThemeSwitch.js';
import { LINKS } from './Header.js';
const ext = { target: '_blank', rel: 'noopener' };
const col = (title, ...kids) => h('div', { class: 'foot-col' }, h('span', { class: 'label' }, title), ...kids);
export const Footer = ({ onTour }) =>
  h('footer', { class: 'site-footer' }, h('div', { class: 'wrap' },
    h('div', { class: 'foot-in' },
      h('div', { class: 'foot-brand' }, h('img', { src: img('logo.png'), alt: C.NAME }),
        h('p', { class: 'foot-tag' }, 'A table set in the shadow of Kilimanjaro.'), h('p', { class: 'soft' }, C.LOCATION)),
      col('Explore', h('ul', {}, LINKS.slice(1).map(([k, l]) => h('li', {}, h('a', { href: `#/${k}` }, l))))),
      col('Reach us', h('ul', {},
        h('li', {}, h('a', { href: `tel:+${C.PHONE_INTL}` }, C.PHONE)),
        h('li', {}, h('a', { href: waLink('Hello!'), ...ext }, 'WhatsApp')),
        h('li', {}, h('a', { href: mailLink('Enquiry', 'Hello,') }, 'Email')),
        h('li', {}, h('a', { href: C.FACEBOOK, ...ext }, 'Facebook')),
        h('li', {}, h('a', { href: C.MAP, ...ext }, 'Find us on the map'))))),
    h('div', { class: 'foot-bar' }, h('p', {}, `© ${new Date().getFullYear()} ${C.NAME}`), ThemeSwitch(),
      h('div', { class: 'foot-mini' }, h('button', { class: 'link', type: 'button', onClick: onTour }, 'Welcome tour'), h('a', { href: '#/admin' }, 'Staff')))));
