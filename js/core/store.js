// Minimal state store persisted to localStorage (per browser).
export function createStore(key, initial) {
  let state = structuredClone(initial);
  try { const saved = JSON.parse(localStorage.getItem(key)); if (saved) state = { ...state, ...saved }; } catch {}
  const subs = new Set();
  return {
    get: () => state,
    set(patch) {
      state = { ...state, ...(typeof patch === 'function' ? patch(state) : patch) };
      try { localStorage.setItem(key, JSON.stringify(state)); } catch {}
      subs.forEach(fn => fn(state));
    },
    subscribe(fn) { subs.add(fn); return () => subs.delete(fn); },
  };
}
