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
// A container that re-renders itself whenever the store changes.
export const live = (store, render) => {
  const box = h('div');
  const draw = () => box.replaceChildren(render(store.get()));
  draw();
  const off = store.subscribe(() => (box.isConnected ? draw() : off()));
  return box;
};
export const toast = msg => {
  const t = h('div', { class: 'toast', role: 'status' }, msg);
  document.body.append(t);
  setTimeout(() => t.remove(), 2200);
};
