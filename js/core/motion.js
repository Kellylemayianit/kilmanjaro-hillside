// Small motion helpers. Everything respects prefers-reduced-motion.
const reduce = () => matchMedia('(prefers-reduced-motion:reduce)').matches;
// Splits a heading into masked words; css/motion.css slides them up in sequence when the heading gets .in.
export function splitWords(el) {
  if (el.dataset.split) return;
  el.dataset.split = '1';
  const text = el.textContent.trim();
  el.setAttribute('aria-label', text);
  el.replaceChildren();
  text.split(/\s+/).forEach((w, i, all) => {
    const mask = document.createElement('span'), inner = document.createElement('span');
    mask.className = 'w'; mask.setAttribute('aria-hidden', 'true');
    inner.style.setProperty('--i', i); inner.textContent = w;
    mask.append(inner); el.append(mask); if (i < all.length - 1) el.append(' ');
  });
  el.classList.add('split');
}
// Counts a number up from 0 (admin stats).
export function countUp(el, ms = 900) {
  const to = +el.textContent;
  if (!to || reduce()) return;
  let t0; el.textContent = 0;
  const step = t => { t0 ??= t; const p = Math.min((t - t0) / ms, 1); el.textContent = Math.round(to * (1 - (1 - p) ** 3)); if (p < 1) requestAnimationFrame(step); };
  requestAnimationFrame(step);
}
