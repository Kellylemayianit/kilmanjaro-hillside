import { CONFIG as C } from '../config.js';
import { money } from './contact.js';
// Cart lives in the store ({ itemId: qty }) so it survives reloads.
export const setQty = (store, id, n) => store.set(s => { const c = { ...s.cart }; n > 0 ? (c[id] = n) : delete c[id]; return { cart: c }; });
export const clearCart = store => store.set({ cart: {} });
export const lines = s => Object.entries(s.cart).map(([id, q]) => ({ item: s.items.find(i => i.id === id), q })).filter(l => l.item);
export const count = s => lines(s).reduce((a, l) => a + l.q, 0);
export const total = s => { const ls = lines(s); return { sum: ls.reduce((a, l) => a + (l.item.price || 0) * l.q, 0), unpriced: ls.filter(l => l.item.price == null).length }; };
export const totalText = s => { const t = total(s); return `${money(t.sum)}${t.unpriced ? ` + ${t.unpriced} item(s) to be priced` : ''}`; };
export const linesText = s => lines(s).map(l => `${l.q} × ${l.item.name}${l.item.price != null ? ` (${money(l.item.price * l.q)})` : ' (ask price)'}`).join('\n');
export const orderText = (s, c) =>
  `Order, ${C.NAME}\nName: ${c.name}\nPhone: ${c.phone}\n${c.needed ? `Needed on: ${c.needed}\n` : ''}\n${linesText(s)}\n\nTotal: ${totalText(s)}${c.notes ? `\nNotes: ${c.notes}` : ''}`;
