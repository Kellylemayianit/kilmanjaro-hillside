import { h, live } from '../core/dom.js';
import { ItemCard } from '../components/ItemCard.js';
// One page factory serves both Menu (type 'food') and Drinks (type 'drink').
export const catalogPage = (store, type, title, intro) => live(store, s => {
  const items = s.items.filter(i => i.type === type);
  const cats = [...new Set(items.map(i => i.cat))];
  return h('section', {}, h('h1', {}, title), h('p', { class: 'muted' }, intro),
    cats.map(c => h('div', {}, h('h2', {}, c), h('div', { class: 'grid' }, items.filter(i => i.cat === c).map(ItemCard)))));
});
