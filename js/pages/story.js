import { h } from '../core/dom.js';
import { StoryBlock } from '../components/StoryBlock.js';
import { waLink } from '../services/contact.js';
// Edit the wording here. Keep it to things that are true for the resort.
export const storyPage = () => h('section', {},
  h('span', { class: 'eyebrow' }, 'Our story'),
  h('h1', {}, 'A table set in the shadow of Kilimanjaro'),
  h('p', {}, 'Kilimanjaro Hillside Resort is a place to slow down in Kimana, Kajiado County, where good food, cold drinks and a quiet bed are never far apart.'),
  StoryBlock({ eyebrow: 'The fire', title: 'It begins at the grill',
    text: 'Meat is roasted slowly over charcoal and turned by hand until it is ready to share, served with ugali, kachumbari and sukuma, the way it is meant to be eaten.',
    img: '2.jpg', alt: 'Chef tending meat on the charcoal grill',
    cta: h('a', { class: 'btn', href: '#/menu' }, 'See the menu') }),
  StoryBlock({ eyebrow: 'The table', title: 'Plates made for sharing', rev: true,
    text: 'Fried tilapia, beef, fresh greens and soft ugali arrive together, with a cold drink from the bar. Nothing rushed, nothing fussy.',
    img: '4.jpg', alt: 'Plate of beef, chips, ugali and sukuma',
    cta: h('a', { class: 'btn alt', href: '#/drinks' }, 'Browse drinks') }),
  StoryBlock({ eyebrow: 'The stay', title: 'Stay a little longer',
    text: 'Come for a long lunch after safari, a weekend with family, or an evening with friends. Settle into the lounge, wander the garden paths, then rest in a room made for quiet.',
    img: '11.jpg', alt: 'Colourful covered lounge with sofas',
    cta: h('a', { class: 'btn', href: '#/rooms' }, 'View rooms') }),
  h('div', { class: 'closing' }, h('hr', { class: 'rule', style: 'margin:0 auto 28px' }),
    h('h2', { style: 'margin-top:0' }, 'We would love to host you'),
    h('div', { class: 'row' },
      h('a', { class: 'btn wa', href: waLink('Hello, I would like to visit.'), target: '_blank', rel: 'noopener' }, 'Say hello on WhatsApp'),
      h('a', { class: 'btn alt', href: '#/contact' }, 'Find us'))));
