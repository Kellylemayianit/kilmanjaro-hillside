import { h } from '../core/dom.js';
import { GALLERY } from '../data/gallery.js';
import { PageHead, Photo, Section, img } from '../components/Blocks.js';
import { modal } from '../components/Modal.js';
export const galleryPage = () => h('div', { class: 'page' }, PageHead('Gallery', 'Real photography from the resort, alongside a few stock landscapes for context. Stock photos are credited.'),
  Section('', h('div', { class: 'masonry' }, GALLERY.map(([f, cap, credit]) =>
    h('button', { class: 'ph-btn', type: 'button', 'aria-label': 'Enlarge: ' + cap, onClick: () => modal(h('figure', { class: 'lightbox' }, h('img', { src: img(f), alt: cap }), h('figcaption', {}, cap + (credit ? ' · ' + credit : ''))), { cls: 'lb', label: cap }) },
      Photo(f, cap, { cls: 'flow', credit }))))));
