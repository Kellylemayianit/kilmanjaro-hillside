// Theme loader. index.html sets data-theme before paint; this module owns changes after that.
const KEY = 'khr-theme';
const subs = new Set();
const sys = matchMedia('(prefers-color-scheme:dark)');
const hasChoice = () => { try { return !!localStorage.getItem(KEY); } catch { return false; } };
export const getTheme = () => document.documentElement.dataset.theme || 'light';
function apply(t) {
  document.documentElement.dataset.theme = t;
  document.querySelector('meta[name=theme-color]')?.setAttribute('content', t === 'dark' ? '#17130F' : '#F6EFE3');
  subs.forEach(fn => fn(t));
}
export const setTheme = t => { try { localStorage.setItem(KEY, t); } catch {} apply(t); };
export const toggleTheme = () => setTheme(getTheme() === 'dark' ? 'light' : 'dark');
export const onTheme = fn => { subs.add(fn); return () => subs.delete(fn); }; // every switch subscribes, so all stay in sync
export const initTheme = () => {
  apply(getTheme());
  sys.addEventListener('change', e => { if (!hasChoice()) apply(e.matches ? 'dark' : 'light'); }); // follow the device until the visitor chooses
};
