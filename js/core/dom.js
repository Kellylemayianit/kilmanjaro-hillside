// Tiny "createElement" helper, like React's h(): h('div', {class:'x', onClick:fn}, child, ...)
export const h = (tag, props = {}, ...kids) => {
  const e = document.createElement(tag);
  for (const [k, v] of Object.entries(props || {})) {
    if (k.startsWith('on')) e.addEventListener(k.slice(2).toLowerCase(), v);
    else if (k === 'class') e.className = v;
    else if (v !== false && v != null) e.setAttribute(k, v === true ? '' : v);
  }
  kids.flat(9).forEach(c => c != null && c !== false && e.append(c.nodeType ? c : document.createTextNode(c)));
  return e;
};
// A container that re-renders whenever the store changes. box.redraw() re-renders on demand (local UI state).
export const live = (store, render) => {
  const box = h('div');
  const draw = () => {
    const k = box.contains(document.activeElement) ? document.activeElement.dataset?.fk : null;
    box.replaceChildren(render(store.get()));
    if (k) box.querySelector(`[data-fk="${k}"]`)?.focus();
  };
  box.redraw = draw; draw();
  const off = store.subscribe(() => (box.isConnected ? draw() : off()));
  return box;
};
export const toast = msg => {
  const t = h('div', { class: 'toast', role: 'status' }, msg);
  document.body.append(t);
  setTimeout(() => t.remove(), 2200);
};
const IC = {
  whatsapp: '<path d="M12 3a9 9 0 0 0-7.8 13.5L3 21l4.6-1.2A9 9 0 1 0 12 3z" fill="none" stroke="currentColor" stroke-width="1.6"/><path d="M9 8.5c0 3.5 3 6.5 6.5 6.5l1-1.6-2-1-.9.9c-1-.4-2-1.4-2.4-2.4l.9-.9-1-2z" fill="currentColor"/>',
  menu: '<path d="M4 7h16M4 12h16M4 17h16" stroke="currentColor" stroke-width="1.6" fill="none"/>',
  close: '<path d="M6 6l12 12M18 6L6 18" stroke="currentColor" stroke-width="1.6" fill="none"/>',
  arrow: '<path d="M4 12h16M14 6l6 6-6 6" stroke="currentColor" stroke-width="1.6" fill="none"/>',
  check: '<path d="M5 12.5l4.5 4.5L19 7.5" stroke="currentColor" stroke-width="1.6" fill="none"/>',
  bag: '<path d="M5 8h14l-1 12H6L5 8zM9 8a3 3 0 0 1 6 0" stroke="currentColor" stroke-width="1.6" fill="none"/>',
  sun: '<circle cx="12" cy="12" r="4" fill="none" stroke="currentColor" stroke-width="1.6"/><path d="M12 2v2M12 20v2M2 12h2M20 12h2M5 5l1.5 1.5M17.5 17.5L19 19M19 5l-1.5 1.5M6.5 17.5L5 19" stroke="currentColor" stroke-width="1.6"/>',
  moon: '<path d="M20 14.5A8 8 0 0 1 9.5 4a8 8 0 1 0 10.5 10.5z" fill="none" stroke="currentColor" stroke-width="1.6"/>',
};
export const icon = (name, size = 20) => {
  const s = h('span', { class: 'ic', 'aria-hidden': 'true' });
  s.innerHTML = `<svg viewBox="0 0 24 24" width="${size}" height="${size}">${IC[name]}</svg>`; // constants above only
  return s;
};
