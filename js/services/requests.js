import { remote, insertRequest, listRequests, patchRequestRow, deleteRequestRow } from './backend.js';
import { requestText } from './contact.js';
// Requests = quote requests, cart orders, enquiries. Guests add one; staff manage them (Supabase RLS enforces this).
export const newRequest = (kind, o) => {
  const r = { id: crypto.randomUUID?.() || 'r' + Date.now(), created: new Date().toISOString(), kind, status: 'New', name: o.name, phone: o.phone,
    email: o.email || '', title: o.title, details: o.details || [], message: o.message || '', quote: null, thread: [] };
  r.thread = [{ at: r.created, dir: 'in', channel: 'form', text: requestText(r) }]; // the guest's own request is the first message in the conversation
  return r;
};
export async function submitRequest(store, r) {
  if (!remote) return store.set(s => ({ requests: [r, ...s.requests] }));
  try { await insertRequest(r); } catch (e) { console.warn('Could not save request', e); } // guest can still send by WhatsApp even if saving fails
}
export async function refreshRequests(store) {
  if (!remote) return;
  const rows = await listRequests();
  store.set({ requests: rows.map(x => ({ ...x, email: x.email || '', details: x.details || [], thread: x.thread || [] })) });
}
export async function updateRequest(store, id, p) {
  store.set(s => ({ requests: s.requests.map(x => (x.id === id ? { ...x, ...p } : x)) }));
  if (remote) await patchRequestRow(id, p);
}
export async function removeRequest(store, id) {
  store.set(s => ({ requests: s.requests.filter(x => x.id !== id) }));
  if (remote) await deleteRequestRow(id);
}
