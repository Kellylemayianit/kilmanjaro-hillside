import { h } from '../core/dom.js';
const NUMS = [...Array(20)].map((_, i) => i + 1).filter(n => n !== 17); // 17 = logo
export function galleryPage() {
  const big = h('img', { alt: '' });
  const dlg = h('dialog', { class: 'lb', 'aria-label': 'Photo viewer', onClick: () => dlg.close() }, big);
  return h('section', {}, h('h1', {}, 'Gallery'),
    h('div', { class: 'gal' }, NUMS.map(n => h('img', { src: `assets/img/${n}.jpg`, alt: `Resort photo ${n}`, loading: 'lazy',
      onClick: () => { big.src = `assets/img/${n}.jpg`; dlg.showModal(); } }))), dlg);
}
