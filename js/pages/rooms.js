import { h, live } from '../core/dom.js';
import { money } from '../services/contact.js';
import { PageHead, Photo, Label, Section } from '../components/Blocks.js';
import { BookingWizard } from '../components/BookingWizard.js';
export const roomsPage = store => {
  const wiz = BookingWizard(store);
  return h('div', { class: 'page' }, PageHead('Rooms & cottages', 'Two room types. Pricing isn’t published: send a request with your dates and the resort will reply with availability.'),
    live(store, s => h('div', {}, s.rooms.map((r, n) => Section('editorial-row reveal in' + (n % 2 ? ' reverse' : ''), Photo(r.img, r.name),
      h('div', { class: 'editorial-copy' }, Label(r.name), h('h2', {}, r.tag), h('p', {}, r.desc),
        h('p', { class: 'strong' }, money(r.price) + (r.price ? ' / night' : '')),
        h('button', { class: 'btn', type: 'button', onClick: () => wiz.pick(r.name) }, 'Ask about this room')))))),
    Section('wizard-wrap reveal', wiz));
};
