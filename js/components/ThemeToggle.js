import { h } from '../core/dom.js';
import { getTheme, setTheme } from '../services/theme.js';
export function ThemeToggle() {
  const b = h('button', { class: 'theme', type: 'button', 'aria-label': 'Switch between light and dark mode' });
  const draw = () => (b.textContent = getTheme() === 'dark' ? '☀ Light mode' : '☾ Dark mode');
  b.addEventListener('click', () => { setTheme(getTheme() === 'dark' ? 'light' : 'dark'); draw(); });
  draw();
  return b;
}
