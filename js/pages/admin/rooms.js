import { h, icon, toast } from '../../core/dom.js';
import { commit } from '../../services/catalog.js';
import { removeImage } from '../../services/media.js';
import { AHead, numField, textField } from './shared.js';
import { MediaGrid } from './media.js';
// Rooms: name, headline, description, guide price per night, and any number of photos.
export function roomsAdminPage(store) {
  const box = h('div');
  const patch = (id, p) => commit(store, s => ({ rooms: s.rooms.map(r => (r.id === id ? { ...r, ...p } : r)) }));
  const card = r => h('article', { class: 'room-card' },
    h('div', { class: 'rc-fields' },
      h('div', { class: 'field' }, h('label', {}, 'Room name'), textField(r.name, v => v && patch(r.id, { name: v }), 'Room name')),
      h('div', { class: 'field' }, h('label', {}, 'Guide price per night (KSh)'), numField(r.price, v => patch(r.id, { price: v }), `Price for ${r.name}`), h('small', { class: 'soft' }, 'Shown as “From KSh … / night”. Empty = quote only.')),
      h('div', { class: 'field full' }, h('label', {}, 'Headline'), textField(r.tag, v => patch(r.id, { tag: v }), 'Headline')),
      h('div', { class: 'field full' }, h('label', { for: 'rd-' + r.id }, 'Description'), h('textarea', { id: 'rd-' + r.id, rows: 3, onChange: e => patch(r.id, { desc: e.target.value.trim() }) }, r.desc || ''))),
    h('div', {}, h('span', { class: 'label' }, 'Photos (the first one is the main photo)'),
      MediaGrid({ items: (r.images?.length ? r.images : [r.img]).filter(Boolean).map(src => ({ src })), folder: 'rooms', onChange: list => patch(r.id, { images: list.map(x => x.src), img: list[0]?.src || null }) })),
    h('div', { class: 'rc-foot' }, h('button', { class: 'btn sm quiet', type: 'button', onClick: () => {
      if (!confirm(`Delete “${r.name}” and its photos?`)) return;
      (r.images || []).forEach(removeImage); commit(store, s => ({ rooms: s.rooms.filter(x => x.id !== r.id) })); draw();
    } }, icon('trash', 18), 'Delete room')));
  const draw = () => box.replaceChildren(AHead('Admin · Content', 'Rooms', h('button', { class: 'btn solid', type: 'button', onClick: () => {
    commit(store, s => ({ rooms: [...s.rooms, { id: 'rm' + Date.now().toString(36), name: 'New room', tag: 'Short headline', desc: '', img: null, images: [], price: null }] })); draw(); toast('Room added. Fill in the details below.');
  } }, icon('plus', 18), 'Add room')), h('p', { class: 'soft' }, 'Guests still ask for a quote; the guide price just helps them decide.'),
    ...(store.get().rooms.length ? store.get().rooms.map(card) : [h('p', { class: 'empty' }, 'No rooms yet.')]));
  draw();
  return box;
}
