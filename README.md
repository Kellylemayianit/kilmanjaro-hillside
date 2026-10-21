# Kilimanjaro Hillside Resort: website

Plain HTML + CSS + vanilla JS (ES modules), structured like a small React app.

```
index.html          shell
css/styles.css      tokens, light/dark theme, layout
js/main.js          boot: store, router, layout
js/config.js        phone, email, admin PIN, map link  <- edit me
js/core/            dom.js (h, live), store.js, router.js
js/components/      Sidebar, ThemeToggle, ItemCard, BookingForm, SendButtons, Onboarding
js/pages/           home, catalog (menu+drinks), rooms, gallery, contact, admin
js/services/        theme.js, contact.js (WhatsApp / SMS / email links)
js/data/seed.js     starting menu, rooms
```

## Run
ES modules need a web server (not double-click):
`python3 -m http.server 8000` then open http://localhost:8000
Or deploy the folder as-is to Cloudflare Pages / Netlify / GitHub Pages.

## Admin
Open `#/admin`. Default PIN is in `js/config.js` (change it).
Stock, prices and bookings are saved in the browser's localStorage, so edits show only on the device used.
For edits that every visitor sees, a small backend is needed (e.g. Cloudflare D1/KV); `js/core/store.js` is the one place to swap.
