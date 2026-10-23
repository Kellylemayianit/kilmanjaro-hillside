import { h } from '../core/dom.js';
import { CONFIG as C } from '../config.js';
import { waLink } from '../services/contact.js';
import { Btn, PageHead, Editorial, Section } from '../components/Blocks.js';
import { openQuote } from '../components/QuoteForm.js';
export const servicesPage = store => {
  const quote = kind => Btn('Get a quote', { kind: 'solid', onClick: () => openQuote(store, kind) });
  return h('div', { class: 'page' },
    PageHead('Services', 'More than a table and a room. Tell us what you have in mind and we will send you a quote.'),
    Editorial({ label: 'Safaris', title: 'Safaris from Kimana', file: 'setting.jpg', alt: 'Kilimanjaro rising over the savannah', credit: 'Stock photo · Pexels',
      text: 'We can arrange safaris for you, starting from the resort. Tell us where you would like to go, when, and how many of you are travelling.', cta: quote('safari') }),
    Editorial({ label: 'Events hosting', title: 'Celebrate with us', rev: true, file: 'real-lounge-wide.jpg', alt: 'Covered lounge with sofas',
      text: 'Host your celebration or gathering at the resort. The covered lounge, the garden and the bar make an easy, relaxed setting. Tell us the type of event, the date and the number of guests.', cta: quote('event') }),
    Editorial({ label: 'Outside catering', title: 'Our kitchen, at your venue', file: 'real-grill-2.jpg', alt: 'Charcoal and fire',
      text: 'We cater for events outside the resort too. Tell us the date, the place and how many people to feed, and we will put together a quote.', cta: quote('catering') }),
    Section('closing reveal', h('h2', { class: 'i' }, 'Not sure what you need?'), h('p', { class: 'soft' }, 'Message us and we will help you plan it.'),
      h('div', { class: 'hero-actions center' }, Btn('Chat on WhatsApp', { href: waLink('Hello, I would like to ask about your services.'), kind: 'wa', ext: true }), Btn(`Call ${C.PHONE_DISPLAY}`, { href: `tel:+${C.PHONE_INTL}` }))));
};
