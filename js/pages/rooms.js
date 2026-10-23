import { h } from '../core/dom.js';
import { money } from '../services/contact.js';
import { Btn, PageHead, Label, Section, Photo, img } from '../components/Blocks.js';
import { openQuote } from '../components/QuoteForm.js';
// Room photos and prices are managed in Admin > Rooms. A price is "from" a guide figure; the final amount is still quoted per stay.
function roomSection(store, r, n) {
  const pics = r.images?.length ? r.images : [r.img];
  const main = h('div', {}, Photo(pics[0], r.name));
  const thumbs = pics.length > 1 && h('div', { class: 'thumbs' }, pics.map((p, k) => h('button', { class: 'thumb' + (k ? '' : ' on'), type: 'button', 'aria-label': `Show photo ${k + 1} of ${r.name}`,
    onClick: e => { main.replaceChildren(Photo(p, r.name)); thumbs.querySelectorAll('.thumb').forEach(t => t.classList.toggle('on', t === e.currentTarget)); } }, h('img', { src: img(p), alt: '', loading: 'lazy' }))));
  return Section('editorial-row reveal' + (n % 2 ? ' reverse' : ''), h('div', { class: 'room-media' }, main, thumbs || null),
    h('div', { class: 'editorial-copy' }, Label(r.name), h('h2', {}, r.tag), h('p', {}, r.desc),
      r.price ? h('p', { class: 'room-price' }, h('small', {}, 'From '), money(r.price), h('small', {}, ' / night')) : null,
      Btn('Get a quote', { kind: 'solid', onClick: () => openQuote(store, 'room', { room: r.name }) })));
}
export const roomsPage = store => h('div', { class: 'page' },
  PageHead('Rooms', 'Simple, colourful rooms. Prices are a guide; tell us your dates and we will send you a quote.'),
  store.get().rooms.map((r, n) => roomSection(store, r, n)));
