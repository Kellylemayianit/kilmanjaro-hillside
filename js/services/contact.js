import { CONFIG as C } from '../config.js';
const q = encodeURIComponent;
// Kenyan numbers: 0712... -> 254712...
export const intl = p => { const d = String(p).replace(/\D/g, ''); return d.startsWith('254') ? d : '254' + d.replace(/^0/, ''); };
export const RESORT = { whatsapp: C.PHONE_INTL, sms: C.PHONE_INTL, email: C.EMAIL };
// The three ways to hand a message off. `to` is a phone (intl) or an email address.
export const CHANNELS = {
  whatsapp: { label: 'WhatsApp', href: (to, t) => `https://wa.me/${to}?text=${q(t)}`, ext: true },
  sms: { label: 'SMS', href: (to, t) => `sms:+${to}?body=${q(t)}` },
  email: { label: 'Email', href: (to, t, s = 'Enquiry') => `mailto:${to}?subject=${q(s)}&body=${q(t)}` },
};
export const waLink = text => CHANNELS.whatsapp.href(C.PHONE_INTL, text);
export const mailLink = (subject, text) => CHANNELS.email.href(C.EMAIL, text, subject);
export const money = p => (p == null || p === '' ? 'Ask for price' : 'KSh ' + Number(p).toLocaleString());
export const nights = (a, b) => Math.round((new Date(b) - new Date(a)) / 864e5);
export const fmtDate = d => new Date(d + 'T12:00').toLocaleDateString('en-GB', { day: 'numeric', month: 'short' });
export const fmtRange = (a, b) => `${fmtDate(a)} – ${fmtDate(b)}`;
export const KIND = { room: 'Room', safari: 'Safari', event: 'Event hosting', catering: 'Outside catering', order: 'Order' };
export const requestText = r =>
  `Quote request, ${C.NAME}\nService: ${KIND[r.kind]}\n${r.title}\n${r.details.map(([k, v]) => `${k}: ${v}`).join('\n')}\nName: ${r.name}\nPhone: ${r.phone}${r.email ? `\nEmail: ${r.email}` : ''}${r.message ? `\nMessage: ${r.message}` : ''}`;
export const enquiryText = f => `Enquiry, ${C.NAME}\nName: ${f.name}\nPhone: ${f.phone}\n${f.checkIn ? `Dates: ${f.checkIn} to ${f.checkOut}\n` : ''}${f.message || ''}`.trim();
// Admin -> guest replies
export const replyText = r => {
  const what = `${KIND[r.kind].toLowerCase()} request (${r.title})`;
  return ({
    Quoted: `Hello ${r.name}, here is your quote for the ${what}: ${r.quote ? money(r.quote) : 'we will confirm the price shortly'}. Reply here if you would like to go ahead.`,
    Confirmed: `Hello ${r.name}, your ${what} is confirmed. We look forward to hosting you at ${C.NAME}.`,
    Cancelled: `Hello ${r.name}, we are sorry, we are unable to help with your ${what}. Please message us to talk through other options.`,
  }[r.status] || `Hello ${r.name}, thank you for your ${what}. We will send you a quote shortly.`);
};
export const guestDest = r => ({ whatsapp: intl(r.phone), sms: intl(r.phone), email: r.email || '' });
