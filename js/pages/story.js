import { h } from '../core/dom.js';
import { waLink } from '../services/contact.js';
import { Btn, PageHead, Editorial, SettingBand, Section, Label } from '../components/Blocks.js';
// Edit the wording here. Keep it to things that are true for the resort.
export const storyPage = () => h('div', { class: 'page' },
  PageHead('A table set in the shadow of Kilimanjaro', 'Kilimanjaro Hillside Resort is a place to slow down in Kimana, Kajiado County, where good food, cold drinks and a quiet bed are never far apart.'),
  Editorial({ label: 'The fire', title: 'It begins at the grill', file: 'real-grill-1.jpg', alt: 'Chef tending meat on the charcoal grill',
    text: 'Meat is roasted slowly over charcoal and turned by hand until it is ready to share: nyama choma served with ugali, kachumbari and sukuma wiki, the way it is meant to be eaten.', cta: Btn('See the menu', { href: '#/menu' }) }),
  Editorial({ label: 'The table', title: 'Plates made for sharing', rev: true, file: 'real-plate-1.jpg', alt: 'Plate of beef, ugali and sukuma',
    text: 'Fried tilapia, beef, fresh greens and soft ugali arrive together, with a cold drink from the bar. Nothing rushed, nothing fussy: a long lunch after a game drive, or an evening with friends.', cta: Btn('Browse drinks', { href: '#/drinks' }) }),
  Editorial({ label: 'The stay', title: 'Stay a little longer', file: 'real-room-comfort.jpg', alt: 'Comfort double with a lace canopy',
    text: 'Settle into the lounge, wander the garden paths, then rest in a room made for quiet. Come for lunch, a weekend with family, or an evening with friends, and stay the night if the mood takes you.', cta: Btn('View rooms', { href: '#/rooms' }) }),
  SettingBand({ label: 'The setting', title: 'Kimana, Kajiado County', file: 'gallery-3.jpg', credit: 'Stock photo · Pexels, not the resort',
    text: 'The resort sits on the savannah corridor between Amboseli National Park and Mount Kilimanjaro, a well-known gateway for travellers moving between Amboseli and the Tsavo parks.' }),
  Section('closing reveal', h('h2', { class: 'i' }, 'We would love to host you'),
    h('div', { class: 'hero-actions center' }, Btn('Say hello on WhatsApp', { href: waLink('Hello, I would like to visit.'), kind: 'wa', ext: true }), Btn('Find us', { href: '#/contact' }))));
