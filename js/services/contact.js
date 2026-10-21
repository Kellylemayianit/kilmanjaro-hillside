import { CONFIG as C } from '../config.js';
const q = encodeURIComponent;
export const waLink = text => `https://wa.me/${C.PHONE_INTL}?text=${q(text)}`;
export const smsLink = text => `sms:+${C.PHONE_INTL}?body=${q(text)}`;
export const mailLink = (subject, text) => `mailto:${C.EMAIL}?subject=${q(subject)}&body=${q(text)}`;
export const bookingText = b =>
  `Booking request, ${C.NAME}\nRoom: ${b.room}\nName: ${b.name}\nPhone: ${b.phone}\nCheck-in: ${b.checkIn}\nCheck-out: ${b.checkOut}\nGuests: ${b.guests}`;
export const money = p => (p == null || p === '' ? 'Ask for price' : 'KSh ' + Number(p).toLocaleString());
