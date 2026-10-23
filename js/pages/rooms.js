import { h } from '../core/dom.js';
import { Btn, PageHead, Editorial } from '../components/Blocks.js';
import { openQuote } from '../components/QuoteForm.js';
export const roomsPage = store => h('div', { class: 'page' },
  PageHead('Rooms', 'Simple, colourful rooms. Room prices depend on your dates, so tell us when you would like to stay and we will send you a quote.'),
  store.get().rooms.map((r, n) => Editorial({ label: r.name, title: r.tag, text: r.desc, file: r.img, alt: r.name, rev: n % 2,
    cta: Btn('Get a quote', { kind: 'solid', onClick: () => openQuote(store, 'room', { room: r.name }) }) })));
