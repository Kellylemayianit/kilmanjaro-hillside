import { h, live, icon, toast } from '../core/dom.js';
import { money } from '../services/contact.js';
import { lines, count, totalText, linesText, orderText, clearCart } from '../services/cart.js';
import { newRequest, submitRequest } from '../services/requests.js';
import { modal } from './Modal.js';
import { Handoff } from './Handoff.js';
import { Qty } from './Qty.js';
// Header button with a live item count.
export function CartButton(store) {
  const badge = h('span', { class: 'badge' });
  const b = h('button', { class: 'cart-btn', type: 'button', onClick: () => openCart(store) }, icon('bag'), h('span', { class: 'cart-label' }, 'Order'), badge);
  const draw = () => { const n = count(store.get()); badge.textContent = n; badge.hidden = !n; b.setAttribute('aria-label', n ? `Open your order, ${n} item${n > 1 ? 's' : ''}` : 'Open your order'); };
  draw(); store.subscribe(draw);
  return b;
}
// Side panel: review quantities, add details, then hand the whole order off in one message.
export function openCart(store) {
  const cust = { name: '', phone: '', needed: '', notes: '' };
  const body = h('div', { class: 'sheet-body cart' });
  const m = modal(body, { cls: 'panel-right', label: 'Your order' });
  const field = (l, n, o = {}) => h('div', { class: 'field' + (o.full ? ' full' : '') }, h('label', { for: 'cart-' + n }, l),
    o.area ? h('textarea', { id: 'cart-' + n, rows: 3, placeholder: o.ph, onInput: e => (cust[n] = e.target.value) })
      : h('input', { id: 'cart-' + n, type: o.type || 'text', value: cust[n], required: o.req, autocomplete: o.ac, onInput: e => (cust[n] = e.target.value) }));
  const list = live(store, s => {
    const ls = lines(s);
    if (!ls.length) return h('p', { class: 'empty' }, 'Your order is empty. Add items from the menu.');
    return h('div', {}, h('ul', { class: 'cart-lines' }, ls.map(({ item, q }) => h('li', { class: 'cl' },
      h('div', { class: 'cl-name' }, h('strong', {}, item.name), h('small', { class: 'soft' }, money(item.price))), Qty(store, item),
      h('span', { class: 'pr' }, item.price != null ? money(item.price * q) : '–')))),
      h('div', { class: 'cl-total' }, h('span', { class: 'label' }, 'Total'), h('strong', {}, totalText(s))));
  });
  const cartView = () => body.replaceChildren(h('span', { class: 'label' }, 'Bulk & group orders'), h('h2', {}, 'Your order'), list,
    h('form', { class: 'form-grid', onSubmit: e => { e.preventDefault(); if (!count(store.get())) return toast('Add something to your order first'); sendView(); } },
      field('Your name', 'name', { req: true, ac: 'name' }), field('Phone', 'phone', { type: 'tel', req: true, ac: 'tel' }),
      field('Needed on (optional)', 'needed', { type: 'date', full: true }),
      field('Notes', 'notes', { area: true, full: true, ph: 'Bulk or event order? Tell us the date, place and numbers.' }),
      h('div', { class: 'full row-actions' }, h('button', { class: 'btn solid', type: 'submit' }, 'Send order'),
        h('button', { class: 'btn quiet', type: 'button', onClick: () => { clearCart(store); toast('Order cleared'); } }, 'Clear order'))));
  const sendView = async () => {
    const s = store.get(), text = orderText(s, cust), n = count(s);
    const r = newRequest('order', { name: cust.name, phone: cust.phone, title: `${n} item${n > 1 ? 's' : ''}`, message: cust.notes,
      details: [['Items', linesText(s)], ['Total', totalText(s)], cust.needed && ['Needed on', cust.needed]].filter(Boolean) });
    await submitRequest(store, r); clearCart(store);
    body.replaceChildren(h('span', { class: 'label' }, 'Order saved'), h('h2', {}, 'Send your order'),
      Handoff(store, { text, subject: 'Order', next: ['The resort receives your order', 'We confirm the items, total and pickup or delivery time', 'Keep your phone nearby'] }));
  };
  cartView();
  return m;
}
