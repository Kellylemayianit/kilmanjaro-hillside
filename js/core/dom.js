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
  inbox: '<path d="M4 13l2-8h12l2 8M4 13v6h16v-6M4 13h5l1 2h4l1-2h5" stroke="currentColor" stroke-width="1.6" fill="none"/>',
  dash: '<path d="M4 4h7v7H4zM13 4h7v4h-7zM13 10h7v10h-7zM4 13h7v7H4z" stroke="currentColor" stroke-width="1.6" fill="none"/>',
  fork: '<path d="M7 3v8M5 3v5a2 2 0 0 0 4 0V3M7 11v10M16 3c-2 2-2 6 0 8v10M16 3v18" stroke="currentColor" stroke-width="1.6" fill="none"/>',
  bed: '<path d="M3 18V7M3 14h18v4M21 14v-3a3 3 0 0 0-3-3h-7v6" stroke="currentColor" stroke-width="1.6" fill="none"/><circle cx="7" cy="11" r="1.6" fill="currentColor"/>',
  photos: '<rect x="3" y="5" width="18" height="14" rx="2" stroke="currentColor" stroke-width="1.6" fill="none"/><path d="M3 16l5-5 4 4 3-3 6 6" stroke="currentColor" stroke-width="1.6" fill="none"/>',
  doc: '<path d="M6 3h9l3 3v15H6zM9 11h6M9 15h6" stroke="currentColor" stroke-width="1.6" fill="none"/>',
  gear: '<circle cx="12" cy="12" r="3" stroke="currentColor" stroke-width="1.6" fill="none"/><path d="M12 2v3M12 19v3M2 12h3M19 12h3M5 5l2 2M17 17l2 2M19 5l-2 2M7 17l-2 2" stroke="currentColor" stroke-width="1.6"/>',
  out: '<path d="M10 4H5v16h5M15 8l4 4-4 4M19 12H9" stroke="currentColor" stroke-width="1.6" fill="none"/>',
  sms: '<path d="M4 5h16v11H9l-5 4z" stroke="currentColor" stroke-width="1.6" fill="none"/>',
  mail: '<rect x="3" y="5" width="18" height="14" rx="2" stroke="currentColor" stroke-width="1.6" fill="none"/><path d="M3 7l9 6 9-6" stroke="currentColor" stroke-width="1.6" fill="none"/>',
  phone: '<path d="M5 4h4l2 5-2.500 1.500a11 11 0 0 0 5 5L15 13l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2z" stroke="currentColor" stroke-width="1.6" fill="none"/>',
  plus: '<path d="M12 5v14M5 12h14" stroke="currentColor" stroke-width="1.6" fill="none"/>',
  trash: '<path d="M5 7h14M10 7V4h4v3M7 7l1 13h8l1-13" stroke="currentColor" stroke-width="1.6" fill="none"/>',
  cloud: '<path d="M7 18a4 4 0 0 1 0-8 5 5 0 0 1 9.500-1A4.500 4.500 0 0 1 17 18z" stroke="currentColor" stroke-width="1.6" fill="none"/>',
  sun: '<circle cx="12" cy="12" r="4" fill="none" stroke="currentColor" stroke-width="1.6"/><path d="M12 2v2M12 20v2M2 12h2M20 12h2M5 5l1.5 1.5M17.5 17.5L19 19M19 5l-1.5 1.5M6.5 17.5L5 19" stroke="currentColor" stroke-width="1.6"/>',
  moon: '<path d="M20 14.5A8 8 0 0 1 9.5 4a8 8 0 1 0 10.5 10.5z" fill="none" stroke="currentColor" stroke-width="1.6"/>',
};
export const icon = (name, size = 20) => {
  const s = h('span', { class: 'ic', 'aria-hidden': 'true' });
  s.innerHTML = `<svg viewBox="0 0 24 24" width="${size}" height="${size}">${IC[name]}</svg>`; // constants above only
  return s;
};
