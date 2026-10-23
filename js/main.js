import { h, icon } from './core/dom.js';
import { createStore } from './core/store.js';
import { startRouter } from './core/router.js';
import { armReveals } from './core/reveal.js';
import { ready } from './core/splash.js';
import { SEED } from './data/seed.js';
import { CONFIG } from './config.js';
import { initTheme } from './services/theme.js';
import { loadCatalog } from './services/catalog.js';
import { remote } from './services/backend.js';
import { waLink } from './services/contact.js';
import { Header } from './components/Header.js';
import { Footer } from './components/Footer.js';
import { openOnboarding, maybeOnboard } from './components/Onboarding.js';
import { homePage } from './pages/home.js';
import { storyPage } from './pages/story.js';
import { menuPage } from './pages/menu.js';
import { servicesPage } from './pages/services.js';
import { roomsPage } from './pages/rooms.js';
import { galleryPage } from './pages/gallery.js';
import { contactPage } from './pages/contact.js';
import { adminPage } from './pages/admin/index.js';

initTheme();
const store = createStore('khr-state-v3', SEED);

// Two shells: the public site (header, footer, WhatsApp button) and the admin dashboard (own sidebar layout).
const header = Header(store);
const view = h('main', { id: 'view', tabindex: '-1' });
const site = h('div', { id: 'site' }, header, view,
  Footer({ onTour: () => openOnboarding(store) }),
  h('a', { class: 'whatsapp-float', href: waLink('Hello, I have a question.'), target: '_blank', rel: 'noopener', 'aria-label': 'Chat on WhatsApp' }, icon('whatsapp', 26)));
const admin = h('div', { id: 'admin-root' });
document.getElementById('app').append(site, admin);

const pub = page => ({ shell: 'site', page });
const routes = {
  home: pub(() => homePage(store)),
  story: pub(() => storyPage(store)),
  menu: pub(() => menuPage(store)),
  drinks: pub(() => menuPage(store)), // old link, now part of the Menu
  rooms: pub(() => roomsPage(store)),
  services: pub(() => servicesPage(store)),
  gallery: pub(() => galleryPage(store)),
  contact: pub(() => contactPage(store)),
  admin: { shell: 'admin', page: sub => adminPage(store, sub) },
};
const TITLES = { home: '', story: 'Our story', menu: 'Menu', drinks: 'Menu', rooms: 'Rooms', services: 'Services', gallery: 'Gallery', contact: 'Contact', admin: 'Admin' };

const router = startRouter(routes, (key, sub, r, soft) => {
  const isAdmin = r.shell === 'admin';
  site.hidden = isAdmin; admin.hidden = !isAdmin;
  const outlet = isAdmin ? admin : view;
  outlet.replaceChildren(r.page(sub));
  header.setActive(key);
  document.title = (TITLES[key] ? TITLES[key] + ' · ' : '') + CONFIG.NAME;
  if (!soft) scrollTo(0, 0); ready.then(() => armReveals(outlet)); // first load waits for the splash; later routes resolve instantly
});
ready.then(() => maybeOnboard(store));
// Visitors see cached data instantly; fresh prices/photos from Supabase arrive a moment later and the page redraws in place.
if (remote) loadCatalog(store).then(r => r.changed && !location.hash.startsWith('#/admin') && !document.querySelector('dialog[open]') && router.refresh());
