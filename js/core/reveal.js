import { splitWords } from './motion.js';
// Scroll reveal: .reveal blocks, split headings and the hero animate once when they enter the viewport.
const HEADINGS = '.hero h1,.page-head h1,.quote-band blockquote,.setting-inner h2,.editorial-copy h2,.intro-grid h2,.closing h2,.menu-sec h2,.gallery-head h2,.contact-grid h2';
const io = 'IntersectionObserver' in window
  ? new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } }), { threshold: 0.12 })
  : null;
export function armReveals(root) {
  root.querySelectorAll(HEADINGS).forEach(splitWords);
  root.querySelectorAll('.reveal:not(.in),.split:not(.in),.hero:not(.in)').forEach(el => (io ? io.observe(el) : el.classList.add('in')));
}
