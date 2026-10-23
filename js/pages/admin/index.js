import { h, toast } from '../../core/dom.js';
import { CONFIG as C } from '../../config.js';
import { img, Btn } from '../../components/Blocks.js';
import { ThemeSwitch } from '../../components/ThemeSwitch.js';
import { overviewPage } from './overview.js';
import { requestsPage } from './requests.js';
import { stockPage } from './stock.js';
import { pricesPage } from './prices.js';
// Admin shell: its own layout (sidebar + content), drawn into #admin-root by main.js. PIN is client-side only.
const TABS = { '': ['Overview', overviewPage], requests: ['Requests', requestsPage], stock: ['Stock', stockPage], prices: ['Prices', pricesPage] };
const ok = () => sessionStorage.getItem('khr-admin') === '1';
export function adminPage(store, sub = '') {
  const redraw = () => dispatchEvent(new HashChangeEvent('hashchange'));
  if (!ok()) return h('div', { class: 'a-login' }, h('form', { class: 'a-card', onSubmit: e => {
    e.preventDefault();
    if (new FormData(e.target).get('pin') === C.ADMIN_PIN) { sessionStorage.setItem('khr-admin', '1'); redraw(); } else toast('Wrong PIN');
  } }, h('img', { src: img('logo.png'), alt: '' }), h('span', { class: 'label' }, 'Staff only'), h('h1', { class: 'i' }, 'Admin sign in'),
    h('div', { class: 'field' }, h('label', { for: 'pin' }, 'PIN'), h('input', { id: 'pin', name: 'pin', type: 'password', inputmode: 'numeric', autocomplete: 'off', required: true })),
    h('button', { class: 'btn solid', type: 'submit' }, 'Sign in'), h('a', { class: 'soft small', href: '#/home' }, '← Back to the site')));
  const key = TABS[sub] ? sub : '';
  const badge = h('span', { class: 'badge' });
  const upd = () => { const n = store.get().requests.filter(r => r.status === 'New').length; badge.textContent = n; badge.hidden = !n; };
  upd(); const off = store.subscribe(() => (badge.isConnected ? upd() : off()));
  return h('div', { class: 'a-shell' },
    h('aside', { class: 'a-side' },
      h('div', { class: 'a-brand' }, h('span', { class: 'a-logo' }, h('img', { src: img('logo.png'), alt: '' })), h('div', {}, h('strong', {}, C.SHORT), h('span', { class: 'label' }, 'Admin'))),
      h('nav', { 'aria-label': 'Admin' }, Object.entries(TABS).map(([k, [l]]) => h('a', { href: k ? `#/admin/${k}` : '#/admin', 'aria-current': k === key ? 'page' : null }, l, k === 'requests' ? badge : null))),
      h('div', { class: 'a-side-foot' }, ThemeSwitch(), h('a', { href: '#/home' }, 'View public site ↗'),
        h('button', { class: 'link', type: 'button', onClick: () => { sessionStorage.removeItem('khr-admin'); redraw(); } }, 'Sign out'))),
    h('main', { class: 'a-main', id: 'admin-main', tabindex: '-1' }, TABS[key][1](store)));
}
