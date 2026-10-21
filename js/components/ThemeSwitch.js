import { h, icon } from '../core/dom.js';
import { getTheme, toggleTheme, onTheme } from '../services/theme.js';
// Accessible on/off switch (role=switch). On = dark. compact hides the text label.
export function ThemeSwitch({ compact = false } = {}) {
  const label = h('span', { class: 'sw-label' });
  const b = h('button', { class: 'sw' + (compact ? ' compact' : ''), type: 'button', role: 'switch', 'aria-label': 'Dark mode', onClick: toggleTheme },
    h('span', { class: 'sw-track', 'aria-hidden': 'true' }, icon('sun', 14), icon('moon', 14)), compact ? null : label);
  const draw = () => { const d = getTheme() === 'dark'; b.setAttribute('aria-checked', d); label.textContent = d ? 'Dark' : 'Light'; };
  draw(); onTheme(draw);
  return b;
}
