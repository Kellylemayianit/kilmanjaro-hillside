import { h } from '../core/dom.js';
// Reusable layout pieces from the design: photo, label, buttons, page head, editorial row, bands.
const src = f => `assets/img/${f}`;
export const img = src;
export const Photo = (file, alt, { cls = '', credit } = {}) =>
  h('figure', { class: 'ph ' + cls }, h('img', { src: src(file), alt, loading: 'lazy' }), credit && h('figcaption', { class: 'credit' }, credit));
export const Label = (t, dark) => h('span', { class: 'label' + (dark ? ' on-dark' : '') }, t);
export const Btn = (text, { href, onClick, kind = '', ext } = {}) => href
  ? h('a', { class: 'btn ' + kind, href, ...(ext ? { target: '_blank', rel: 'noopener' } : {}) }, text)
  : h('button', { class: 'btn ' + kind, type: 'button', onClick }, text);
export const TextLink = (text, href, dark = false) => h('a', { class: 'text-link' + (dark ? '' : ' dark'), href }, text);
export const PageHead = (title, dek) =>
  h('header', { class: 'page-head' }, h('div', { class: 'wrap' }, h('h1', {}, title), dek && h('p', { class: 'dek' }, dek)));
export const Section = (cls, ...kids) => h('section', { class: cls }, h('div', { class: 'wrap' }, kids));
export const Editorial = ({ label, title, text, note, tags, file, alt, rev, cta, credit }) =>
  Section('editorial-row reveal' + (rev ? ' reverse' : ''),
    Photo(file, alt, { credit }),
    h('div', { class: 'editorial-copy' }, Label(label), h('h2', {}, title), h('p', {}, text),
      note && h('p', { class: 'note' }, note),
      tags && h('ul', { class: 'tag-list' }, tags.map(t => h('li', {}, t))), cta));
export const QuoteBand = (quote, cite) =>
  h('section', { class: 'quote-band reveal' }, h('div', { class: 'wrap' }, h('blockquote', {}, quote), h('cite', {}, cite)));
export const SettingBand = ({ label, title, text, file, credit }) =>
  h('section', { class: 'setting-band' }, h('img', { class: 'media', src: src(file), alt: '', loading: 'lazy' }), h('div', { class: 'scrim' }),
    h('div', { class: 'wrap' }, h('div', { class: 'setting-inner reveal' }, Label(label, true), h('h2', {}, title), h('p', {}, text),
      credit && h('span', { class: 'credit-line' }, credit))));
