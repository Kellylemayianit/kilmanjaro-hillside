import { h, icon } from './core/dom.js';
import { createStore } from './core/store.js';
import { startRouter } from './core/router.js';
import { armReveals } from './core/reveal.js';
import { SEED } from './data/seed.js';
import { CONFIG } from './config.js';
import { initTheme } from './services/theme.js';
import { waLink } from './services/contact.js';
import { Header } from './components/Header.js';
import { Footer } from './components/Footer.js';
import { openOnboarding, maybeOnboard } from './components/Onboarding.js';
import { homePage } from './pages/home.js';
import { storyPage } from './pages/story.js';
import { catalogPage } from './pages/catalog.js';
import { roomsPage } from './pages/rooms.js';
import { galleryPage } from './pages/gallery.js';
import { contactPage } from './pages/contact.js';
import { adminPage } from './pages/admin/index.js';

initTheme();
const store = createStore('khr-state', SEED);

// Two shells: the public site (header, footer, WhatsApp button) and the admin dashboard (own sidebar layout).
const header = Header();
const view = h('main', { id: 'view', tabindex: '-1' });
const site = h('div', { id: 'site' }, header, view,
  Footer({ onTour: () => openOnboarding(store) }),
  h('a', { class: 'whatsapp-float', href: waLink('Hello, I have a question.'), target: '_blank', rel: 'noopener', 'aria-label': 'Chat on WhatsApp' }, icon('whatsapp', 26)));
const admin = h('div', { id: 'admin-root' });
document.getElementById('app').append(site, admin);

const pub = page => ({ shell: 'site', page });
const routes = {
  home: pub(homePage),
  story: pub(storyPage),
  menu: pub(() => catalogPage(store, 'food', 'Menu', 'Roasted fresh. Tap an item to order on WhatsApp.')),
  drinks: pub(() => catalogPage(store, 'drink', 'Drinks', 'Spirits, beer and soft drinks. Must be 18+ to order alcohol.')),
  rooms: pub(() => roomsPage(store)),
  gallery: pub(galleryPage),
  contact: pub(() => contactPage(store)),
  admin: { shell: 'admin', page: sub => adminPage(store, sub) },
};
const TITLES = { home: '', story: 'Our story', menu: 'Menu', drinks: 'Drinks', rooms: 'Rooms', gallery: 'Gallery', contact: 'Contact', admin: 'Admin' };

startRouter(routes, (key, sub, r) => {
  const isAdmin = r.shell === 'admin';
  site.hidden = isAdmin; admin.hidden = !isAdmin;
  const outlet = isAdmin ? admin : view;
  outlet.replaceChildren(r.page(sub));
  header.setActive(key);
  document.title = (TITLES[key] ? TITLES[key] + ' · ' : '') + CONFIG.NAME;
  scrollTo(0, 0); armReveals(outlet);
});
maybeOnboard(store);
