import { h, icon, toast } from '../../core/dom.js';
import { CONFIG as C } from '../../config.js';
import { remote, signIn, signOut, session } from '../../services/backend.js';
import { loadCatalog, publishNow, onSave } from '../../services/catalog.js';
import { img } from '../../components/Blocks.js';
import { ThemeSwitch } from '../../components/ThemeSwitch.js';
import { overviewPage } from './overview.js';
import { requestsPage } from './requests.js';
import { menuItemsPage } from './menuitems.js';
import { roomsAdminPage } from './rooms.js';
import { galleryAdminPage } from './gallery.js';
import { printedPage } from './printed.js';
import { settingsPage } from './settings.js';
// Admin shell: grouped sidebar (a slide-in drawer on phones). Remote mode signs in with Supabase email + password; local mode uses the PIN.
const GROUPS = [
  ['Inbox', [['', 'Overview', 'dash', overviewPage], ['requests', 'Requests', 'inbox', requestsPage]]],
  ['Content', [['items', 'Menu items', 'fork', menuItemsPage], ['rooms', 'Rooms', 'bed', roomsAdminPage], ['gallery', 'Gallery', 'photos', galleryAdminPage], ['printed', 'Printed menu', 'doc', printedPage]]],
  ['Settings', [['settings', 'Connection', 'gear', settingsPage]]],
];
const TABS = Object.fromEntries(GROUPS.flatMap(([, l]) => l).map(([k, label, ic, page]) => [k, { label, page }]));
const authed = () => (remote ? !!session() : sessionStorage.getItem('khr-admin') === '1');
let booted = false;
export function adminPage(store, sub = '') {
  const redraw = () => dispatchEvent(new HashChangeEvent('hashchange'));
  if (!authed()) return login(store, redraw);
  if (!booted && remote) { booted = true; loadCatalog(store).then(r => { if (!r.found && !r.error) publishNow(store).then(() => toast('Catalogue published')).catch(() => {}); }); }
  const key = TABS[sub] ? sub : '';
  const badge = h('span', { class: 'badge' });
  const upd = () => { const n = store.get().requests.filter(r => r.status === 'New').length; badge.textContent = n; badge.hidden = !n; };
  upd(); const off = store.subscribe(() => (badge.isConnected ? upd() : off()));
  const pill = h('div', { class: 'save-pill', role: 'status' });
  const show = (t, kind) => { pill.className = 'save-pill ' + kind; pill.replaceChildren(icon('cloud', 16), t); };
  show(remote ? 'Connected' : 'Local demo (this device only)', remote ? 'ok' : 'warn');
  const offSave = onSave(st => { if (!pill.isConnected) return offSave(); if (st === 'saving') show('Saving…', 'busy'); else if (st === 'saved') { show(remote ? 'All changes saved' : 'Saved on this device', remote ? 'ok' : 'warn'); } else { show('Not saved', 'bad'); toast('Could not save: ' + st.slice(6)); if (/sign in/i.test(st)) { signOut(); redraw(); } } });
  const setDrawer = o => { side.classList.toggle('open', o); scrim.classList.toggle('open', o); document.body.classList.toggle('lock', o); };
  const nav = h('nav', { 'aria-label': 'Admin' }, GROUPS.map(([g, links]) => h('div', { class: 'ng' }, h('span', { class: 'ng-t' }, g), links.map(([k, label, ic]) =>
    h('a', { href: k ? `#/admin/${k}` : '#/admin', 'aria-current': k === key ? 'page' : null, onClick: () => setDrawer(false) }, icon(ic, 20), h('span', {}, label), k === 'requests' ? badge : null)))));
  const side = h('aside', { class: 'a-side' },
    h('div', { class: 'a-brand' }, h('span', { class: 'a-logo' }, h('img', { src: img('logo.png'), alt: '' })), h('div', {}, h('strong', {}, C.SHORT), h('span', { class: 'label' }, 'Admin'))),
    nav, h('div', { class: 'a-side-foot' }, pill, ThemeSwitch(), h('a', { href: '#/home' }, icon('out', 18), 'View public site'),
      h('button', { class: 'link', type: 'button', onClick: () => { signOut(); sessionStorage.removeItem('khr-admin'); redraw(); } }, 'Sign out')));
  const scrim = h('div', { class: 'scrim', onClick: () => setDrawer(false) });
  return h('div', { class: 'a-shell' }, h('header', { class: 'a-top' }, h('span', { class: 'a-top-t' }, TABS[key].label),
    h('button', { class: 'burger', type: 'button', 'aria-label': 'Open admin menu', onClick: () => setDrawer(true) }, icon('menu'), h('span', {}, 'Menu'))),
    scrim, side, h('main', { class: 'a-main', id: 'admin-main', tabindex: '-1' }, TABS[key].page(store)));
}
function login(store, redraw) {
  const f = { email: C.EMAIL, pw: '' };
  return h('div', { class: 'a-login' }, h('form', { class: 'a-card', onSubmit: async e => {
    e.preventDefault(); const btn = e.target.querySelector('button[type=submit]'); btn.disabled = true;
    try {
      if (remote) { await signIn(f.email, f.pw); } else if (f.pw === C.ADMIN_PIN) sessionStorage.setItem('khr-admin', '1'); else throw new Error('Wrong PIN');
      booted = false; redraw();
    } catch (err) { toast(remote ? 'Wrong email or password' : err.message); btn.disabled = false; }
  } }, h('img', { src: img('logo.png'), alt: '' }), h('span', { class: 'label' }, 'Staff only'), h('h1', { class: 'i' }, 'Admin sign in'),
    remote && h('div', { class: 'field' }, h('label', { for: 'em' }, 'Email'), h('input', { id: 'em', type: 'email', value: f.email, autocomplete: 'username', required: true, onInput: e => (f.email = e.target.value) })),
    h('div', { class: 'field' }, h('label', { for: 'pw' }, remote ? 'Password' : 'PIN'), h('input', { id: 'pw', type: 'password', autocomplete: remote ? 'current-password' : 'off', inputmode: remote ? null : 'numeric', required: true, onInput: e => (f.pw = e.target.value) })),
    h('button', { class: 'btn solid', type: 'submit' }, 'Sign in'),
    !remote && h('p', { class: 'soft small' }, 'Local demo mode. Connect Supabase for real staff accounts.'), h('a', { class: 'soft small', href: '#/home' }, '← Back to the site')));
}
