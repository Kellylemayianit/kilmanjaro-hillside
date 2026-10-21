export const getTheme = () => document.documentElement.dataset.theme || 'light';
export const setTheme = t => {
  document.documentElement.dataset.theme = t;
  try { localStorage.setItem('khr-theme', t); } catch {}
};
