// Hash router: #/menu, #/rooms ... Each route is a function returning a DOM node.
export function startRouter(routes, outlet, onChange) {
  const go = () => {
    const key = location.hash.replace(/^#\/?/, '') || 'home';
    const name = routes[key] ? key : 'home';
    outlet.replaceChildren(routes[name]());
    onChange?.(name);
    window.scrollTo(0, 0);
  };
  addEventListener('hashchange', go);
  go();
}
