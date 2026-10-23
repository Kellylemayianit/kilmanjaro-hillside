import { h } from '../core/dom.js';
import { CONFIG as C } from '../config.js';
import { Btn, PageHead, Editorial, QuoteBand, Section } from '../components/Blocks.js';
import { openQuote } from '../components/QuoteForm.js';
// The resort's own words. Edit the text here.
export const storyPage = store => h('div', { class: 'page' },
  PageHead('Our story', 'Welcome to Kilimanjaro Hillside Resort, your home away from home, nestled in the beautiful surroundings of Kimana, Lormeuti.'),
  Editorial({ label: 'Who we are', title: 'A passion for hospitality', file: 'real-garden-umbrellas.jpg', alt: 'Garden seating under green umbrellas',
    text: 'Our story is built on a passion for hospitality, a love for good food and a desire to create a place where people can relax, connect, celebrate and make beautiful memories. We believe that every guest deserves a warm welcome, quality service, delicious meals and a comfortable environment to unwind.' }),
  Editorial({ label: 'Our promise', title: 'Care, in every detail', rev: true, file: 'real-grill-1.jpg', alt: 'Meat roasting on the charcoal grill',
    text: 'We are committed to creating memorable experiences through genuine hospitality, attention to detail and a dedication to serving our guests with care. Every visit is an opportunity for us to make you feel valued, appreciated and at home.' }),
  QuoteBand('“It’s more than just a stay or a meal — it’s an experience, a feeling and a memory worth keeping.”', 'Kilimanjaro Hillside Resort'),
  Section('closing reveal', h('h2', { class: 'i' }, 'We look forward to welcoming you'),
    h('p', { class: 'soft' }, 'We look forward to welcoming you and being part of your special moments.'),
    h('p', { class: 'foot-tag center' }, `${C.NAME}. ${C.TAGLINE}`),
    h('div', { class: 'hero-actions center' }, Btn('See the menu', { href: '#/menu', kind: 'solid' }), Btn('Get a quote', { onClick: () => openQuote(store) }))));
