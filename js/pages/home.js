import { h } from '../core/dom.js';
import { CONFIG as C } from '../config.js';
import { openQuote } from '../components/QuoteForm.js';
import { img, Btn, Label, TextLink, Section, Editorial, QuoteBand, SettingBand, Photo } from '../components/Blocks.js';
const START = [['menu', 'Eat & drink', 'Breakfast, platters, tea and the bar'], ['rooms', 'Stay', 'Simple, colourful rooms'], ['services', 'Safaris, events & catering', 'Tell us what you have in mind']];
const row = ([k, t, s]) => h('a', { class: 'start-row', href: `#/${k}` }, h('span', {}, h('strong', {}, t), h('small', {}, s)), h('span', { 'aria-hidden': 'true' }, '→'));
export const homePage = store => h('div', { class: 'page' },
  h('section', { class: 'hero' }, h('img', { class: 'media', src: img('real-garden-umbrellas.jpg'), alt: 'Garden seating under green umbrellas' }), h('div', { class: 'hero-scrim' }),
    h('figure', { class: 'hero-inset' }, h('img', { src: img('real-grill-1.jpg'), alt: 'Meat roasting on the charcoal grill' })),
    h('div', { class: 'wrap' }, h('div', { class: 'hero-content' },
      h('span', { class: 'hero-chip' }, 'Kimana · Lormeuti'),
      h('h1', {}, 'A table set in the shadow of Kilimanjaro'),
      h('p', { class: 'sub' }, 'Good food, cold drinks and a comfortable room in Kimana, Lormeuti. Where comfort meets hospitality and memories are made.'),
      h('div', { class: 'hero-actions' }, Btn('See the menu', { href: '#/menu', kind: 'solid' }), Btn('Get a quote', { kind: 'in-dark', onClick: () => openQuote(store) }))))),
  Section('intro-grid reveal',
    h('div', {}, Label('Welcome'), h('h2', {}, 'Your home away from home'),
      h('p', {}, 'Welcome to Kilimanjaro Hillside Resort, nestled in the beautiful surroundings of Kimana, Lormeuti. A place where people can relax, connect, celebrate and make beautiful memories.')),
    h('div', {}, Label('Start here'), h('div', { class: 'start-list' }, START.map(row)))),
  Editorial({ label: 'Accommodation', title: 'Simple, colourful rooms', file: 'real-room-double.jpg', alt: 'Double room with a wooden bed',
    text: 'Two room types, each with its own character: a Double room with bright walls and a garden outlook, and a Comfort double with a carved headboard and lace canopy. Tell us your dates and we will send you a quote.', cta: Btn('Get a quote', { kind: 'solid', onClick: () => openQuote(store, 'room') }) }),
  Editorial({ label: 'Facilities & experiences', title: 'One menu, from breakfast to the bar', rev: true, file: 'real-grill-2.jpg', alt: 'Charcoal grill and fire',
    text: 'Breakfast, nyama choma, family platters, tea and coffee, soft drinks and a bar, all on one menu. Every meal is served with a complimentary plate of fresh fruit.', cta: Btn('See the menu', { href: '#/menu' }) }),
  Section('intro-grid reveal',
    h('div', {}, Label('More than a stay'), h('h2', {}, 'Safaris, events and outside catering'),
      h('p', {}, 'We also arrange safaris, host events and cater outside the resort. Tell us what you have in mind and we will send you a quote.')),
    h('div', {}, h('div', { class: 'start-list' }, [['services', 'Safaris', 'Starting from the resort'], ['services', 'Events hosting', 'Lounge, garden and bar'], ['services', 'Outside catering', 'Our kitchen at your venue']].map(row)))),
  QuoteBand('“It’s more than just a stay or a meal — it’s an experience, a feeling and a memory worth keeping.”', 'Good food · Great moments · Beautiful memories'),
  SettingBand({ label: 'The setting', title: 'Kimana, Lormeuti', file: 'setting.jpg', credit: 'Stock photo · Pexels, not the resort',
    text: 'Kilimanjaro Hillside Resort sits in Kimana, on the savannah corridor between Amboseli National Park and Mount Kilimanjaro, one of East Africa’s best-known views of the mountain.' }),
  Section('reveal', h('div', { class: 'gallery-head' }, h('h2', { class: 'i' }, 'Gallery'), TextLink('View full gallery →', '#/gallery')),
    h('div', { class: 'gallery-grid' }, store.get().gallery.slice(0, 5).map((g, n) => h('div', { class: 'g' + (n + 1) }, Photo(g.src, g.cap || 'Photo'))))),
  h('section', { class: 'contact-band reveal' }, h('div', { class: 'wrap contact-grid' },
    h('div', {}, Label('Contact & reservations'), h('h2', { class: 'i' }, 'Plan your stay'),
      h('ul', { class: 'contact-list' }, [['Phone & WhatsApp', C.PHONE_DISPLAY], ['Location', C.LOCATION], ['Hours', C.HOURS]].map(([k, v]) => h('li', {}, h('span', { class: 'k' }, k), h('span', { class: 'v' }, v))))),
    h('div', { class: 'enquire-box' }, h('h3', {}, 'Get a quote'), h('p', {}, 'Rooms, safaris, events or outside catering. Tell us the details and we will send you a quote.'), Btn('Get a quote', { kind: 'solid', onClick: () => openQuote(store) })))));
