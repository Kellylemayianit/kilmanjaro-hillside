# Kilimanjaro Hillside Resort: website

Plain HTML + CSS + vanilla JS (ES modules). No build step, no dependencies. Single-page app with a hash router.

```
index.html              shell + theme loader (sets light/dark before first paint)
css/
  tokens.css            fonts, colours, spacing, light + dark themes   <- edit the look here
  base.css              reset, type, buttons, forms, reveal
  layout.css            header, drawer, footer, hero, sections, editorial rows, bands
  components.css        cards, theme switch, modal/sheet, handoff, wizard, onboarding
  admin.css             dashboard shell, stats, tables
fonts/                  Fraunces (display) + Work Sans (body), self-hosted
assets/img/             photos + logo
js/
  main.js               boot: theme, store, shells (site | admin), router
  config.js             phone, email, admin PIN, map, Facebook   <- edit me
  core/                 dom.js (h, live, icon, toast), store.js, router.js, reveal.js
  services/             theme.js, contact.js (WhatsApp / SMS / email links + message text)
  data/                 seed.js (menu, rooms, defaults), gallery.js
  components/           Header, Footer, ThemeSwitch, Blocks (design pieces), Modal,
                        Handoff (offload flow), BookingWizard, Onboarding, ItemCard
  pages/                home, story, catalog (menu + drinks), rooms, gallery, contact
  pages/admin/          index (shell + PIN), overview, bookings, stock, prices
```

## Run
ES modules need a web server (not double-click): `python3 -m http.server 8000` then open http://localhost:8000
Or deploy the folder as-is to Cloudflare Pages / Netlify / GitHub Pages.

## Flows
- **Onboarding** (`components/Onboarding.js`): welcome, what brings you (Eat / Stay / Drinks), how should we reach you. Saved as `prefs`; replay from the footer ("Welcome tour").
- **Handoff / offload** (`components/Handoff.js`): every order, booking, enquiry and admin reply ends in the same step. The visitor sees the message, picks WhatsApp, SMS or Email (their onboarding choice is first), and gets a "one tap left" confirmation.
- **Booking**: Rooms page, 3 steps (request, review, send). Saved as status *New* when confirmed on step 2.

## Theme
`index.html` sets `data-theme` before paint from `localStorage('khr-theme')` or the device setting. `js/services/theme.js` handles changes; every `ThemeSwitch` subscribes so they stay in sync. Colours live in `css/tokens.css` (`[data-theme=dark]`).

## Admin
Open `#/admin`. Default PIN is in `js/config.js` (change it). Sections: Overview, Bookings (status + reply to guest), Stock, Prices.
Data is saved in the browser's localStorage, so edits show only on the device used. For edits every visitor sees, a small backend is needed (e.g. Cloudflare D1/KV); `js/core/store.js` is the one place to swap.

## Look and feel notes
- **Softness:** three radius tokens in `css/tokens.css` (`--r-sm` 6px, `--r` 10px, `--r-lg` 14px) are applied by the "Soft corners" block at the end of `css/components.css`. Set them all to `0` for the sharper editorial look.
- **Navigation:** 16px links with a 48px hit area, a tinted pill + underline on the current page, and a labelled "Menu" button below 1020px. The nav styles live at the top of `css/layout.css`.
- **Animation gotcha:** `css/motion.css` hides some copy until its section gets `.in` (added by `core/reveal.js`). Anything you hide that way must sit inside a `.reveal` element (or be the `.reveal` element, as `.intro-grid.in` does), or it will never appear.
