import { h } from '../../core/dom.js';
import { commit } from '../../services/catalog.js';
import { AHead } from './shared.js';
import { MediaGrid } from './media.js';
// Gallery: the first five photos also appear on the home page, so put your best ones first.
export const galleryAdminPage = store => h('div', {}, AHead('Admin · Content', 'Gallery'),
  h('p', { class: 'soft' }, 'Add, caption, reorder and remove photos. The first five also appear on the home page. Photos are resized before uploading, so phone photos are fine.'),
  MediaGrid({ items: store.get().gallery, folder: 'gallery', captions: true,
    onChange: list => commit(store, { gallery: list.map((g, n) => ({ id: g.id || 'g' + Date.now().toString(36) + n, src: g.src, cap: g.cap || '', credit: g.credit })) }) }));
