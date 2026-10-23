import { fetchCatalog, putCatalog, remote } from './backend.js';
// The catalogue is what visitors see: menu items + prices, rooms, gallery, printed menu. Admin edits go through commit().
const KEYS = ['items', 'rooms', 'gallery', 'poster'];
export const pick = s => Object.fromEntries(KEYS.map(k => [k, s[k]]));
const subs = new Set();
export const onSave = fn => { subs.add(fn); return () => subs.delete(fn); };
const emit = st => subs.forEach(f => f(st));
// Pulls the latest published catalogue into the store. Returns { found, changed }.
export async function loadCatalog(store) {
  try {
    const c = await fetchCatalog();
    if (!c) return { found: false };
    const next = Object.fromEntries(KEYS.filter(k => c[k]).map(k => [k, c[k]]));
    const changed = JSON.stringify(pick({ ...store.get(), ...next })) !== JSON.stringify(pick(store.get()));
    if (changed) store.set(next);
    return { found: true, changed };
  } catch (e) { return { found: false, error: e.message }; }
}
let timer;
// Update the store and (when connected) save to Supabase after a short pause, so typing a price doesn't fire a request per keystroke.
export function commit(store, patch) {
  store.set(patch);
  if (!remote) return emit('saved');
  emit('saving'); clearTimeout(timer);
  timer = setTimeout(async () => { try { await putCatalog(pick(store.get())); emit('saved'); } catch (e) { emit('error:' + e.message); } }, 600);
}
export const publishNow = store => putCatalog(pick(store.get()));
