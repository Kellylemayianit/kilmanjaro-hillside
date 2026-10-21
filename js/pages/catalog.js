import { h, live } from '../core/dom.js';
import { ItemCard } from '../components/ItemCard.js';
import { PageHead, Editorial, Section, Label } from '../components/Blocks.js';
// One page factory serves Menu (type 'food') and Drinks (type 'drink').
const INTRO = {
  food: { label: 'Dining', title: 'Nyama choma, cooked outdoors', file: 'real-grill-1.jpg', alt: 'Charcoal grill', tags: ['Nyama choma', 'Plates', 'Fish'],
    text: 'Meat is roasted slowly over charcoal and turned by hand, served with ugali, kachumbari and sukuma wiki. Fried tilapia is also on offer, and plates are made for sharing.',
    note: 'Prices are set by the resort and shown here once added. Until then, ask on WhatsApp.' },
  drink: { label: 'The bar', title: 'A fully stocked bar', file: 'real-bar.jpg', alt: 'The resort bar', tags: ['Tusker', 'White Cap', 'Jameson', 'Amarula', 'Viceroy'],
    text: 'Spirits, beer and soft drinks, from Tusker and White Cap to Jameson, Amarula and Viceroy brandy. A proper bar, not just a fridge.',
    note: 'You must be 18+ to order alcohol.' },
};
export const catalogPage = (store, type, title, dek) => h('div', { class: 'page' }, PageHead(title, dek),
  Editorial({ ...INTRO[type] }),
  live(store, s => {
    const items = s.items.filter(i => i.type === type);
    return Section('', [...new Set(items.map(i => i.cat))].map(c => h('div', { class: 'cat reveal in' },
      h('div', { class: 'gallery-head' }, h('h2', { class: 'i' }, c)), h('div', { class: 'card-grid' }, items.filter(i => i.cat === c).map(ItemCard(store)))))); }),
  type === 'drink' ? Editorial({ label: 'Lounge & grounds', title: 'A covered lounge and garden paths', rev: true, file: 'real-lounge-wide.jpg', alt: 'Covered outdoor lounge',
    text: 'A covered outdoor lounge with sofas and low tables, a separate indoor sitting room, and garden paths connecting it all, a good spot to rest between game drives into Amboseli.' }) : null);
