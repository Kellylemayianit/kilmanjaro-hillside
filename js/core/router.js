// Hash router: #/menu, #/admin/bookings ... routes[key] = { shell, page(sub) }. onRender decides where it is drawn.
export function startRouter(routes, onRender) {
  const go = () => {
    const [k = '', sub = ''] = location.hash.replace(/^#\/?/, '').split('/');
    const key = routes[k] ? k : 'home';
    onRender(key, sub, routes[key]);
  };
  addEventListener('hashchange', go);
  go();
}
