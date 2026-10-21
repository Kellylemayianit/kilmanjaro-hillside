import { h } from './core/dom.js';
import { createStore } from './core/store.js';
import { startRouter } from './core/router.js';
import { SEED } from './data/seed.js';
import { CONFIG } from './config.js';
import { waLink } from './services/contact.js';
import { Sidebar, markActive } from './components/Sidebar.js';
import { Onboarding } from './components/Onboarding.js';
import { homePage } from './pages/home.js';
import { catalogPage } from './pages/catalog.js';
import { roomsPage } from './pages/rooms.js';
import { galleryPage } from './pages/gallery.js';
import { contactPage } from './pages/contact.js';
import { adminPage } from './pages/admin.js';

const store = createStore('khr-state', SEED);
const menuBtn = h('button', { type: 'button', 'aria-label': 'Open menu', 'aria-controls': 'side', 'aria-expanded': 'false',
  onClick: () => setNav(!document.body.classList.contains('nav-open')) }, '☰');
function setNav(open) {
  document.body.classList.toggle('nav-open', open);
  menuBtn.setAttribute('aria-expanded', open);
}
const view = h('main', { id: 'view', tabindex: '-1' });

document.getElementById('app').append(
  h('header', { class: 'top' }, menuBtn, h('strong', {}, 'Kilimanjaro Hillside')),
  Sidebar(),
  h('div', { id: 'scrim', onClick: () => setNav(false) }),
  view,
  h('a', { class: 'btn wa fab', href: waLink('Hello, I have a question.'), target: '_blank', rel: 'noopener' }, 'WhatsApp us'),
  Onboarding());
addEventListener('keydown', e => e.key === 'Escape' && setNav(false));

const routes = {
  home: homePage,
  menu: () => catalogPage(store, 'food', 'Menu', 'Roasted fresh. Tap an item to order on WhatsApp.'),
  drinks: () => catalogPage(store, 'drink', 'Drinks', 'Spirits, beer and soft drinks. Must be 18+ to order alcohol.'),
  rooms: () => roomsPage(store),
  gallery: galleryPage,
  contact: contactPage,
  admin: () => adminPage(store),
};
startRouter(routes, view, name => {
  markActive(name); setNav(false);
  document.title = (name === 'home' ? '' : name[0].toUpperCase() + name.slice(1) + ' · ') + CONFIG.NAME;
});
