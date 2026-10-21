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
export const orderText = i => `Hello, I would like to order: ${i.name}`;
export const bookingText = b =>
  `Booking request, ${C.NAME}\nRoom: ${b.room}\nName: ${b.name}\nPhone: ${b.phone}\nCheck-in: ${b.checkIn}\nCheck-out: ${b.checkOut}\nGuests: ${b.guests}`;
export const enquiryText = f => `Enquiry, ${C.NAME}\nName: ${f.name}\nPhone: ${f.phone}\n${f.checkIn ? `Dates: ${f.checkIn} to ${f.checkOut}\n` : ''}${f.message || ''}`.trim();
// Admin -> guest replies
export const replyText = b => ({
  Confirmed: `Hello ${b.name}, your ${b.room} is confirmed for ${fmtRange(b.checkIn, b.checkOut)}. We look forward to hosting you at ${C.NAME}.`,
  Cancelled: `Hello ${b.name}, we are sorry, we are unable to host your ${b.room} request for ${fmtRange(b.checkIn, b.checkOut)}. Please message us for other dates.`,
}[b.status] || `Hello ${b.name}, thank you for your request for the ${b.room} (${fmtRange(b.checkIn, b.checkOut)}). We will confirm availability shortly.`);
export const guestDest = b => ({ whatsapp: intl(b.phone), sms: intl(b.phone), email: b.email || '' });
