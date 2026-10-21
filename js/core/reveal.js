// Scroll reveal: elements with .reveal fade up once when they enter the viewport.
const io = 'IntersectionObserver' in window
  ? new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } }), { threshold: 0.12 })
  : null;
export const armReveals = root => root.querySelectorAll('.reveal:not(.in)').forEach(el => (io ? io.observe(el) : el.classList.add('in')));
