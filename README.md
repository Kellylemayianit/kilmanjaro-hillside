# Kilimanjaro Hillside Resort: website

Plain HTML + CSS + vanilla JS (ES modules). No build step, no dependencies. Single-page app with a hash router.

```
index.html              shell, theme loader and splash (paint before any JS)
supabase/setup.sql      run once in Supabase: tables, image bucket, security rules
css/                    tokens (colours, light/dark), base, layout, components, admin, motion
fonts/ assets/img/      fonts, starting photos, logo
js/
  main.js               boot: theme, store, shells (site | admin), router, background catalogue refresh
  config.js             phone, email, Supabase URL + anon key   <- edit me
  core/                 dom.js, store.js, router.js, reveal.js, splash.js, motion.js
  services/             backend.js (Supabase client), catalog.js (prices/photos), requests.js (inbox data),
                        media.js (resize + upload), cart.js, contact.js (channels, message text), theme.js
  data/                 seed.js (starting menu, rooms, gallery), menu.js, gallery.js
  components/           Header, Footer, Handoff (send flow), Onboarding, Cart, QuoteForm, Qty, ...
  pages/                home, story, menu, rooms, services, gallery, contact
  pages/admin/          index (sidebar shell + login), overview, requests (inbox), menuitems, rooms,
                        gallery, printed, settings, media (photo controls), shared
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

## Admin and Supabase
Open `#/admin`. Without Supabase it runs in **local demo mode** (PIN in `config.js`, data stays in that browser). To go live:
1. Create a free project at supabase.com. In **SQL Editor**, run `supabase/setup.sql` (tables, a public `media` image bucket, and security rules: visitors can read the catalogue and add a request; only signed-in staff can edit, upload, or read requests).
2. **Authentication > Users > Add user**: create a login for each staff member (e.g. winniemwaniki52@gmail.com).
3. **Project Settings > API**: paste the Project URL and the anon key into `SUPABASE_URL` / `SUPABASE_ANON_KEY` in `js/config.js`, deploy, then sign in at `#/admin`. The first sign-in publishes the starting catalogue.

What staff can do: set prices and stock on every menu item, add/remove items and photos, set room prices and photos, manage the gallery and the printed-menu pages, and work the **Requests inbox**: read each guest's request, change its status, set a quote, and reply on WhatsApp, SMS, email or by phone. Every message sent is logged in the conversation. Photos are resized in the browser, then stored in Supabase Storage.

Data model: menu items, rooms, gallery and printed-menu pages are one JSON row in `site_data` (key `catalog`); guest requests are rows in `requests`. The anon key is public by design; the security rules in `setup.sql` are what protect your data, so run the whole file.
