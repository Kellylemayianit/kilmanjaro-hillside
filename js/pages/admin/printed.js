import { h } from '../../core/dom.js';
import { commit } from '../../services/catalog.js';
import { AHead } from './shared.js';
import { MediaGrid } from './media.js';
// Printed menu: pages guests see under "View the printed menu".
export const printedPage = store => h('div', {}, AHead('Admin · Content', 'Printed menu'),
  h('p', { class: 'soft' }, 'Upload photos or scans of your printed menu, one image per page, in reading order. Guests open them from the Menu page. Remove them all to hide the button.'),
  MediaGrid({ items: store.get().poster.map(src => ({ src })), folder: 'menu', onChange: list => commit(store, { poster: list.map(x => x.src) }) }));
