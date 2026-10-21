// Splash loader: shows on every hard start, then slides up once fonts + page assets are ready (min 1.2s so the drawing finishes, max 4s so slow data never traps the visitor).
// `ready` resolves as the splash starts leaving; the first reveal animations and the onboarding wait for it.
const reduce = matchMedia('(prefers-reduced-motion:reduce)').matches;
const el = document.getElementById('splash');
const wait = ms => new Promise(r => setTimeout(r, ms));
const loaded = new Promise(r => (document.readyState === 'complete' ? r() : addEventListener('load', r, { once: true })));
export const ready = !el ? Promise.resolve() : Promise.race([
  Promise.all([wait(reduce ? 0 : 1200), loaded, document.fonts?.ready]), wait(4000),
]).then(() => {
  el.classList.add('out');
  document.documentElement.classList.remove('booting');
  setTimeout(() => el.remove(), reduce ? 0 : 900);
  return wait(reduce ? 0 : 350); // let the curtain lift before text starts moving
});
