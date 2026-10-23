import { h } from '../core/dom.js';
import { PageHead, Photo, Section, img } from '../components/Blocks.js';
import { modal } from '../components/Modal.js';
// Photos come from the catalogue (staff manage them in Admin > Gallery).
export const galleryPage = store => h('div', { class: 'page' }, PageHead('Gallery', 'A look around the resort. Tap a photo to enlarge it.'),
  Section('', store.get().gallery.length ? h('div', { class: 'masonry' }, store.get().gallery.map(g =>
    h('button', { class: 'ph-btn', type: 'button', 'aria-label': 'Enlarge: ' + (g.cap || 'photo'), onClick: () => modal(h('figure', { class: 'lightbox' }, h('img', { src: img(g.src), alt: g.cap || '' }), h('figcaption', {}, (g.cap || '') + (g.credit ? ' · ' + g.credit : ''))), { cls: 'lb', label: g.cap || 'Photo' }) },
      Photo(g.src, g.cap || 'Photo', { cls: 'flow', credit: g.credit })))) : h('p', { class: 'empty' }, 'Photos coming soon.')));
