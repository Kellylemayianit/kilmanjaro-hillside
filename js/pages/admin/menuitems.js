import { h, icon, toast } from '../../core/dom.js';
import { SECTIONS } from '../../data/menu.js';
import { commit } from '../../services/catalog.js';
import { removeImage } from '../../services/media.js';
import { modal } from '../../components/Modal.js';
import { AHead, numField, textField, stockChip, table } from './shared.js';
import { ImagePicker } from './media.js';
// Add, edit, price, stock and photograph every menu item. Edits save when you leave a field.
export function menuItemsPage(store) {
  const st = { sec: 'all', q: '' };
  const box = h('div');
  const patch = (id, p) => commit(store, s => ({ items: s.items.map(i => (i.id === id ? { ...i, ...p } : i)) }));
  const row = i => h('tr', {},
    h('td', { class: 'c-photo' }, ImagePicker({ value: i.img, name: i.name, folder: 'meals', onChange: v => patch(i.id, { img: v }) })),
    h('td', { class: 'c-name' }, textField(i.name, v => v && patch(i.id, { name: v }), 'Name'), textField(i.desc, v => patch(i.id, { desc: v || null }), 'Description', { ph: 'Description (optional)' })),
    h('td', {}, h('select', { 'aria-label': `Section for ${i.name}`, onChange: e => patch(i.id, { sec: e.target.value }) }, SECTIONS.map(S => h('option', { value: S.id, selected: S.id === i.sec }, S.label))),
      textField(i.cat, v => v && patch(i.id, { cat: v }), 'Group heading', { ph: 'Group, e.g. Beef', list: 'cat-list' })),
    h('td', {}, numField(i.price, v => patch(i.id, { price: v }), `Price for ${i.name}`)),
    h('td', {}, numField(i.stock, v => { patch(i.id, { stock: v }); }, `Stock for ${i.name}`), stockChip(i.stock)),
    h('td', {}, h('button', { class: 'btn sm quiet', type: 'button', 'aria-label': `Delete ${i.name}`, onClick: () => {
      if (!confirm(`Delete “${i.name}” from the menu?`)) return;
      if (i.img) removeImage(i.img); commit(store, s => ({ items: s.items.filter(x => x.id !== i.id) })); draw();
    } }, icon('trash', 18))));
  const addItem = () => {
    const f = { name: '', sec: SECTIONS[0].id, cat: '', price: '' };
    const form = h('form', { class: 'form-grid', onSubmit: e => {
      e.preventDefault();
      if (!f.name.trim()) return toast('Please add a name');
      commit(store, s => ({ items: [...s.items, { id: 'u' + Date.now().toString(36), sec: f.sec, cat: f.cat.trim() || SECTIONS.find(x => x.id === f.sec).label, name: f.name.trim(), price: f.price === '' ? null : +f.price, desc: null, img: null, stock: null }] }));
      m.close(); draw(); toast('Item added. Add a photo from its row if you like.');
    } },
      h('div', { class: 'field full' }, h('label', { for: 'ni-name' }, 'Name'), h('input', { id: 'ni-name', required: true, onInput: e => (f.name = e.target.value) })),
      h('div', { class: 'field' }, h('label', { for: 'ni-sec' }, 'Section'), h('select', { id: 'ni-sec', onChange: e => (f.sec = e.target.value) }, SECTIONS.map(S => h('option', { value: S.id }, S.label)))),
      h('div', { class: 'field' }, h('label', { for: 'ni-cat' }, 'Group heading (optional)'), h('input', { id: 'ni-cat', list: 'cat-list', placeholder: 'e.g. Beef', onInput: e => (f.cat = e.target.value) })),
      h('div', { class: 'field' }, h('label', { for: 'ni-price' }, 'Price (KSh)'), h('input', { id: 'ni-price', type: 'number', min: 0, onInput: e => (f.price = e.target.value) })),
      h('div', { class: 'full' }, h('button', { class: 'btn solid', type: 'submit' }, 'Add item')));
    const m = modal(h('div', { class: 'sheet-body' }, h('span', { class: 'label' }, 'Menu'), h('h2', {}, 'Add an item'), form), { cls: 'sheet', label: 'Add item' });
  };
  const draw = () => {
    const items = store.get().items.filter(i => (st.sec === 'all' || i.sec === st.sec) && (!st.q || i.name.toLowerCase().includes(st.q.toLowerCase())));
    const cats = [...new Set(store.get().items.map(i => i.cat))];
    box.replaceChildren(AHead('Admin · Content', 'Menu items', h('button', { class: 'btn solid', type: 'button', onClick: addItem }, icon('plus', 18), 'Add item')),
      h('datalist', { id: 'cat-list' }, cats.map(c => h('option', { value: c }))),
      h('p', { class: 'soft' }, 'Change a price or stock and tap away to save. Empty price shows “Ask for price”. Stock 0 shows “Sold out”; blank means not tracked.'),
      h('div', { class: 'toolbar' }, h('div', { class: 'tabs', role: 'tablist' }, [['all', 'All'], ...SECTIONS.map(S => [S.id, S.label])].map(([k, l]) =>
        h('button', { class: 'tab' + (st.sec === k ? ' on' : ''), type: 'button', role: 'tab', 'aria-selected': st.sec === k, onClick: () => { st.sec = k; draw(); } }, l))),
        h('input', { class: 'search', type: 'search', placeholder: 'Search items', 'aria-label': 'Search items', value: st.q, onInput: e => { st.q = e.target.value; const pos = e.target.selectionStart; draw(); const s = box.querySelector('.search'); s.focus(); s.setSelectionRange(pos, pos); } })),
      items.length ? table(['Photo', 'Item', 'Section / group', 'Price (KSh)', 'In stock', ''], items.map(row)) : h('p', { class: 'empty' }, 'No items match.'));
  };
  draw();
  return box;
}
