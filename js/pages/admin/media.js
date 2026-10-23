import { h, icon, toast } from '../../core/dom.js';
import { img } from '../../components/Blocks.js';
import { saveImage, removeImage } from '../../services/media.js';
const pickFiles = (multiple, onFiles) => h('input', { type: 'file', accept: 'image/*', multiple, class: 'sr-only', tabindex: '-1', onChange: e => { onFiles([...e.target.files]); e.target.value = ''; } });
// One photo: shows it, with Upload / Replace and Remove.
export function ImagePicker({ value, name, folder, onChange }) {
  const box = h('div', { class: 'imgpick' });
  const draw = (busy = false) => {
    const input = pickFiles(false, async ([f]) => {
      if (!f) return; draw(true);
      try { const url = await saveImage(f, folder), old = value; value = url; onChange(url); if (old) removeImage(old); } catch (e) { toast(e.message || 'Upload failed'); }
      draw();
    });
    box.replaceChildren(value ? h('img', { src: img(value), alt: '' }) : h('span', { class: 'ip-empty', 'aria-hidden': 'true' }, (name || '?')[0]),
      h('div', { class: 'ip-btns' }, h('label', { class: 'btn sm' + (busy ? ' busy' : '') }, busy ? 'Uploading…' : value ? 'Replace' : 'Add photo', input),
        value && !busy && h('button', { class: 'btn sm quiet', type: 'button', 'aria-label': `Remove photo of ${name}`, onClick: () => { if (!confirm('Remove this photo?')) return; const old = value; value = null; onChange(null); removeImage(old); draw(); } }, 'Remove')));
  };
  draw();
  return box;
}
// Many photos: order with arrows, remove, optional caption, add several at once. items = [{src, cap?}]; onChange(newItems) is called after every change.
export function MediaGrid({ items, folder, captions = false, onChange }) {
  const box = h('div', { class: 'mgrid' });
  let list = [...items];
  const set = (next, removed) => { list = next; onChange(list); if (removed) removeImage(removed); draw(); };
  const move = (i, d) => { const n = [...list], j = i + d; if (j < 0 || j >= n.length) return; [n[i], n[j]] = [n[j], n[i]]; set(n); };
  const draw = (busy = false) => {
    box.replaceChildren(...list.map((it, i) => h('figure', { class: 'mtile' }, h('img', { src: img(it.src), alt: it.cap || `Photo ${i + 1}` }),
      captions && h('input', { class: 'txt', value: it.cap || '', placeholder: 'Caption', 'aria-label': `Caption for photo ${i + 1}`, onChange: e => { it.cap = e.target.value.trim(); onChange(list); } }),
      h('div', { class: 'mt-bar' }, h('button', { type: 'button', 'aria-label': 'Move earlier', disabled: i === 0, onClick: () => move(i, -1) }, '◀'),
        h('button', { type: 'button', 'aria-label': 'Move later', disabled: i === list.length - 1, onClick: () => move(i, 1) }, '▶'),
        h('button', { type: 'button', class: 'del', 'aria-label': 'Remove photo', onClick: () => confirm('Remove this photo?') && set(list.filter((_, k) => k !== i), it.src) }, icon('trash', 16))))),
      h('label', { class: 'mtile add' + (busy ? ' busy' : '') }, icon('plus', 22), h('span', {}, busy ? 'Uploading…' : 'Add photos'),
        pickFiles(true, async files => {
          if (!files.length) return; draw(true); const added = [];
          for (const f of files) { try { added.push({ src: await saveImage(f, folder) }); } catch (e) { toast(`${f.name}: ${e.message || 'upload failed'}`); } }
          if (added.length) set([...list, ...added]); else draw();
        })));
  };
  draw();
  return box;
}
