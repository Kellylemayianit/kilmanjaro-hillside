import { CONFIG as C } from '../config.js';
// Tiny Supabase client (REST + Auth + Storage over fetch, no SDK, no build step).
// `remote` is false until SUPABASE_URL and SUPABASE_ANON_KEY are set in config.js; the app then runs in local demo mode.
const BASE = (C.SUPABASE_URL || '').replace(/\/$/, ''), KEY = C.SUPABASE_ANON_KEY || '';
export const remote = !!(BASE && KEY);
const SK = 'khr-sb', PUB = `${BASE}/storage/v1/object/public/media/`;
export const session = () => { try { const s = JSON.parse(sessionStorage.getItem(SK)); return s && s.expires > Date.now() ? s : null; } catch { return null; } };
async function api(path, { method = 'GET', body, headers = {}, blob, authed } = {}) {
  const s = session();
  if (authed && !s) throw Object.assign(new Error('Your session expired. Please sign in again.'), { status: 401 });
  const res = await fetch(BASE + path, { method, body: blob || (body ? JSON.stringify(body) : undefined),
    headers: { apikey: KEY, Authorization: 'Bearer ' + (s?.token || KEY), ...(body ? { 'Content-Type': 'application/json' } : {}), ...headers } });
  if (!res.ok) { if (res.status === 401) sessionStorage.removeItem(SK); throw Object.assign(new Error((await res.text()) || res.statusText), { status: res.status }); }
  return res.status === 204 || !(res.headers.get('content-type') || '').includes('json') ? null : res.json();
}
export async function signIn(email, password) {
  const r = await api('/auth/v1/token?grant_type=password', { method: 'POST', body: { email, password } });
  sessionStorage.setItem(SK, JSON.stringify({ token: r.access_token, email, expires: Date.now() + (r.expires_in - 60) * 1000 }));
}
export const signOut = () => sessionStorage.removeItem(SK);
export const fetchCatalog = async () => (await api('/rest/v1/site_data?key=eq.catalog&select=value'))?.[0]?.value || null;
export const putCatalog = value => api('/rest/v1/site_data', { method: 'POST', authed: true, headers: { Prefer: 'resolution=merge-duplicates,return=minimal' }, body: { key: 'catalog', value, updated_at: new Date().toISOString() } });
export const insertRequest = r => api('/rest/v1/requests', { method: 'POST', headers: { Prefer: 'return=minimal' }, body: r });
export const listRequests = () => api('/rest/v1/requests?select=*&order=created.desc&limit=300', { authed: true });
export const patchRequestRow = (id, p) => api(`/rest/v1/requests?id=eq.${encodeURIComponent(id)}`, { method: 'PATCH', authed: true, headers: { Prefer: 'return=minimal' }, body: p });
export const deleteRequestRow = id => api(`/rest/v1/requests?id=eq.${encodeURIComponent(id)}`, { method: 'DELETE', authed: true });
export const pathOf = url => (url?.startsWith(PUB) ? url.slice(PUB.length) : null);
export const uploadFile = async (path, blob) => { await api(`/storage/v1/object/media/${path}`, { method: 'POST', authed: true, blob, headers: { 'Content-Type': blob.type || 'image/jpeg', 'x-upsert': 'false' } }); return PUB + path; };
export const deleteFile = async url => { const p = pathOf(url); if (p) await api(`/storage/v1/object/media/${p}`, { method: 'DELETE', authed: true }); };
export const ping = () => api('/rest/v1/site_data?select=key&limit=1');
