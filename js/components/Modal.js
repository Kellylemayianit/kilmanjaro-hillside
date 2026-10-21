import { h, icon } from '../core/dom.js';
// Native <dialog>. cls: 'sheet' (bottom sheet on phones) or 'full' (onboarding).
export function modal(content, { cls = '', label = 'Dialog', closable = true } = {}) {
  const d = h('dialog', { class: 'modal ' + cls, 'aria-label': label });
  const close = () => { d.close(); d.remove(); };
  if (closable) {
    d.append(h('button', { class: 'x', type: 'button', 'aria-label': 'Close', onClick: close }, icon('close')));
    d.addEventListener('click', e => e.target === d && close());
  }
  d.addEventListener('cancel', e => { e.preventDefault(); closable && close(); });
  d.append(content);
  document.body.append(d); d.showModal();
  return { close, el: d };
}
