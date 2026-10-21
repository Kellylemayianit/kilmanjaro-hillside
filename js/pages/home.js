import { h } from '../core/dom.js';
import { CONFIG as C } from '../config.js';
import { waLink } from '../services/contact.js';
import { img, Btn, Label, TextLink, Section, Editorial, QuoteBand, SettingBand, Photo } from '../components/Blocks.js';
import { GALLERY } from '../data/gallery.js';
const START = [['menu', 'Eat', 'Nyama choma, fish and Kenyan plates'], ['rooms', 'Stay', 'Simple, colourful rooms near Amboseli'], ['drinks', 'Drinks & events', 'Bar, lounge and garden for gatherings']];
export const homePage = () => h('div', { class: 'page' },
  h('section', { class: 'hero' }, h('img', { class: 'media', src: img('real-lounge-wide.jpg'), alt: 'Covered lounge with sofas and a garden view' }), h('div', { class: 'hero-scrim' }),
    h('figure', { class: 'hero-inset' }, h('img', { src: img('real-grill-1.jpg'), alt: 'Meat roasting on the charcoal grill' })),
    h('div', { class: 'wrap' }, h('div', { class: 'hero-content' },
      h('span', { class: 'hero-chip' }, 'Kimana · gateway to Amboseli & Kilimanjaro'),
      h('h1', {}, 'A table set in the shadow of Kilimanjaro'),
      h('p', { class: 'sub' }, 'Nyama choma, cold drinks and a quiet room, a place to slow down in Kimana, Kajiado County, on the corridor between Amboseli National Park and Mount Kilimanjaro.'),
      h('div', { class: 'hero-actions' }, Btn('Order on WhatsApp', { href: waLink('Hello, I would like to order.'), kind: 'solid', ext: true }), TextLink('See rooms →', '#/rooms', true))))),
  Section('intro-grid reveal',
    h('div', {}, Label('Welcome'), h('h2', {}, 'A place to slow down in Kimana'),
      h('p', {}, 'Good food roasted over charcoal, a cold drink from the bar, and a quiet room for the night. A good stop for a long lunch after a game drive, a weekend with family, or an evening with friends.')),
    h('div', {}, Label('Start here'), h('div', { class: 'start-list' }, START.map(([k, t, s]) =>
      h('a', { class: 'start-row', href: `#/${k}` }, h('span', {}, h('strong', {}, t), h('small', {}, s)), h('span', { 'aria-hidden': 'true' }, '→')))))),
  Editorial({ label: 'Accommodation', title: 'Simple, colourful rooms', file: 'real-room-double.jpg', alt: 'Double room with a wooden bed',
    text: 'Two room types, each with its own character: a Double room with bright walls and a garden outlook, and a Comfort double with a carved headboard and lace canopy. Ask for current pricing.', cta: Btn('View rooms', { href: '#/rooms' }) }),
  Editorial({ label: 'Facilities & experiences', title: 'Nyama choma, cooked outdoors', rev: true, file: 'real-grill-2.jpg', alt: 'Charcoal grill and fire',
    text: 'Meat is roasted slowly over charcoal and turned by hand, served with ugali, kachumbari and sukuma wiki. A full bar and a covered lounge make it an easy place to stay for a while.', cta: Btn('See the menu', { href: '#/menu' }) }),
  QuoteBand('“Nothing rushed, nothing fussy.”', 'From the resort’s own description of itself'),
  SettingBand({ label: 'The setting', title: 'Kimana, Kajiado County', file: 'setting.jpg', credit: 'Stock photo · Pexels, not the resort',
    text: 'Kilimanjaro Hillside Resort sits in Kimana, on the savannah corridor between Amboseli National Park and Mount Kilimanjaro, one of East Africa’s best-known views of the mountain.' }),
  Section('reveal', h('div', { class: 'gallery-head' }, h('h2', { class: 'i' }, 'Gallery'), TextLink('View full gallery →', '#/gallery')),
    h('div', { class: 'gallery-grid' }, GALLERY.slice(4, 9).map(([f, c], n) => h('div', { class: 'g' + (n + 1) }, Photo(f, c))))),
  h('section', { class: 'contact-band reveal' }, h('div', { class: 'wrap contact-grid' },
    h('div', {}, Label('Contact & reservations'), h('h2', { class: 'i' }, 'Plan your stay'),
      h('ul', { class: 'contact-list' }, [['WhatsApp', C.PHONE], ['Location', C.LOCATION], ['Hours', C.HOURS]].map(([k, v]) => h('li', {}, h('span', { class: 'k' }, k), h('span', { class: 'v' }, v))))),
    h('div', { class: 'enquire-box' }, h('h3', {}, 'Send an enquiry'), h('p', {}, 'Use the contact page for dates, party size and any questions about your stay.'), Btn('Go to enquiries', { href: '#/contact', kind: 'solid' })))));
