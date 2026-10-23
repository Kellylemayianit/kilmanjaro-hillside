// Hash router: #/menu, #/admin/requests ... routes[key] = { shell, page(sub) }. onRender decides where it is drawn.
export function startRouter(routes, onRender) {
  const go = soft => {
    const [k = '', sub = ''] = location.hash.replace(/^#\/?/, '').split('/');
    const key = routes[k] ? k : 'home';
    onRender(key, sub, routes[key], soft === true);
  };
  addEventListener('hashchange', () => go());
  go();
  return { refresh: () => go(true) }; // re-draw the current page in place (used when fresh data arrives)
}
