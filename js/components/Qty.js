import { h } from '../core/dom.js';
import { setQty } from '../services/cart.js';
// "Add" button that turns into a - 1 + stepper. Redraws itself on cart changes and keeps keyboard focus.
export function Qty(store, item) {
  const box = h('span', { class: 'qty' });
  const step = (txt, label, to, k) => h('button', { class: 'qb', type: 'button', 'aria-label': `${label} ${item.name}`, 'data-fk': `${item.id}:${k}`, onClick: () => setQty(store, item.id, to) }, txt);
  const draw = () => {
    const key = box.contains(document.activeElement) ? document.activeElement.dataset.fk : null;
    const n = store.get().cart[item.id] || 0, max = item.stock > 0 ? item.stock : 99;
    box.replaceChildren(...(n
      ? [step('−', 'Remove one', n - 1, 'minus'), h('span', { class: 'n', 'aria-live': 'polite' }, n), step('+', 'Add one', Math.min(n + 1, max), 'plus')]
      : [h('button', { class: 'btn sm add', type: 'button', 'data-fk': `${item.id}:add`, 'aria-label': `Add ${item.name} to order`, disabled: item.stock === 0, onClick: () => setQty(store, item.id, 1) }, item.stock === 0 ? 'Sold out' : 'Add')]));
    if (key) (box.querySelector(`[data-fk="${key}"]`) || box.querySelector('button:not([disabled])'))?.focus();
  };
  draw();
  const off = store.subscribe(() => (box.isConnected ? draw() : off()));
  return box;
}
