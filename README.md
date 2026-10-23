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
  data/                 seed.js (menu prices, rooms, defaults), menu.js (menu sections), gallery.js
  components/           Header (sticky), Footer, ThemeSwitch, Blocks, Modal, Handoff (offload flow),
                        Qty (add / - 1 +), Cart (bulk orders), QuoteForm (get a quote), Onboarding, ItemCard
  pages/                home, story, menu (food + drinks + bar in one), rooms, services, gallery, contact
  pages/admin/          index (shell + PIN), overview, requests, stock, prices
```

## Run
ES modules need a web server (not double-click): `python3 -m http.server 8000` then open http://localhost:8000
Or deploy the folder as-is to Cloudflare Pages / Netlify / GitHub Pages.

## Flows
- **Onboarding** (`components/Onboarding.js`): welcome, what brings you (Eat & drink / Stay / Safaris & events), how should we reach you. Saved as `prefs`; replay from the footer ("Welcome tour").
- **Cart / bulk orders** (`components/Cart.js`, `services/cart.js`): every menu item has Add / - 1 +. The header "Order" button shows the count; the panel totals priced items, flags unpriced ones (the bar), takes name, phone, needed-by date and notes, then hands the whole order off in one message.
- **Get a quote** (`components/QuoteForm.js`): rooms, safaris, events hosting and outside catering have no list price. Each asks for its own details, then hands off. Add or edit services in `QUOTE_KINDS`.
- **Handoff / offload** (`components/Handoff.js`): every order, quote, enquiry and admin reply ends here. The visitor sees the message, picks WhatsApp, SMS or Email (their onboarding choice first), and gets a "one tap left" confirmation.

## Theme
`index.html` sets `data-theme` before paint from `localStorage('khr-theme')` or the device setting. `js/services/theme.js` handles changes; every `ThemeSwitch` subscribes so they stay in sync. Colours live in `css/tokens.css` (`[data-theme=dark]`).

## Admin
Open `#/admin`. Default PIN is in `js/config.js` (change it). Sections: Overview, Requests (quote requests and cart orders: set a quote amount, change status, reply to the guest), Stock, Prices.
Data is saved in the browser's localStorage, so edits show only on the device used. For edits every visitor sees, a small backend is needed (e.g. Cloudflare D1/KV); `js/core/store.js` is the one place to swap.
