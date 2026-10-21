import { h } from '../core/dom.js';
// One chapter of the story: text on one side, a photo on the other. rev flips the sides.
export const StoryBlock = ({ eyebrow, title, text, img, alt, rev, cta }) =>
  h('div', { class: 'story' + (rev ? ' rev' : '') },
    h('div', {}, h('span', { class: 'eyebrow' }, eyebrow), h('hr', { class: 'rule' }), h('h2', {}, title), h('p', {}, text), cta),
    h('img', { src: `assets/img/${img}`, alt, loading: 'lazy' }));
