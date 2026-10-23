import { h } from '../core/dom.js';
import { SECTIONS } from '../data/menu.js';
import { money } from '../services/contact.js';
import { PageHead, Photo, Label, Btn, Section, img } from '../components/Blocks.js';
import { Qty } from '../components/Qty.js';
import { ItemCard } from '../components/ItemCard.js';
import { modal } from '../components/Modal.js';
// One Menu for food, tea & coffee, soft drinks and the bar. Prices come from the store (Admin > Prices).
const Row = (store, i) => h('li', { class: 'mrow' + (i.desc ? ' has-desc' : '') },
  h('div', { class: 'mname' }, h('span', { class: 'nm' }, i.name), i.desc && h('small', { class: 'soft' }, i.desc),
    i.stock === 0 ? h('span', { class: 'tag amber' }, 'Sold out') : i.stock > 0 && i.stock <= 3 ? h('span', { class: 'tag amber' }, `Only ${i.stock} left`) : null),
  h('span', { class: 'pr' }, money(i.price)), Qty(store, i));
const sub = t => h('h3', { class: 'msub' }, t);
function section(store, S) {
  const items = store.get().items.filter(i => i.sec === S.id), cats = [...new Set(items.map(i => i.cat))];
  const list = S.bar
    ? h('div', {}, cats.map(c => h('div', { class: 'mgroup' }, sub(c), h('div', { class: 'card-grid' }, items.filter(i => i.cat === c).map(ItemCard(store))))),
      h('p', { class: 'note-line' }, 'Bar prices are not published. Add what you want to your order and we will confirm the price. Must be 18+ to order alcohol.'))
    : h('div', {}, cats.map(c => h('div', { class: 'mgroup' }, cats.length > 1 && sub(c), h('ul', {}, items.filter(i => i.cat === c).map(i => Row(store, i))))));
  const photo = S.photo && !S.bar;
  return h('section', { class: 'menu-sec reveal', id: 'sec-' + S.id }, h('div', { class: 'wrap' },
    h('div', { class: 'ms-head' }, Label(S.label), h('h2', {}, S.title)),
    photo ? h('div', { class: 'ms-grid' }, list, Photo(S.photo, S.alt)) : list));
}
export function menuPage(store) {
  const chips = SECTIONS.map(S => h('button', { class: 'chip-btn', type: 'button', 'data-s': S.id, onClick: () => document.getElementById('sec-' + S.id)?.scrollIntoView({ behavior: 'smooth', block: 'start' }) }, S.label));
  const secs = SECTIONS.map(S => section(store, S));
  if ('IntersectionObserver' in window) { // highlight the chip for the section on screen
    const spy = new IntersectionObserver(es => es.forEach(e => e.isIntersecting && chips.forEach(c => c.toggleAttribute('aria-current', c.dataset.s === e.target.id.slice(4)))), { rootMargin: '-35% 0px -55% 0px' });
    secs.forEach(s => spy.observe(s));
  }
  return h('div', { class: 'page' },
    PageHead('Menu', 'Food, tea and coffee, soft drinks and the bar, all in one place. Add what you need to your order and send it in one message, from a single plate to a big group order.',
      [Btn('View the printed menu', { onClick: () => modal(h('figure', { class: 'lightbox' }, h('img', { src: img('menu-poster.jpg'), alt: 'The printed Kilimanjaro Hillside menu' })), { cls: 'lb', label: 'Printed menu' }) })]),
    h('nav', { class: 'menu-nav', 'aria-label': 'Menu sections' }, h('div', { class: 'wrap chips' }, chips)),
    secs,
    Section('fruit reveal', h('span', { class: 'label' }, 'Complimentary'), h('p', {}, 'Every meal is served with a complimentary plate of fresh melon, orange & pineapple.')));
}
