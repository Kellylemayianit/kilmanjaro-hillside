import { h, toast } from '../../core/dom.js';
import { CONFIG as C } from '../../config.js';
import { remote, session, ping } from '../../services/backend.js';
import { publishNow } from '../../services/catalog.js';
import { SEED } from '../../data/seed.js';
import { AHead, chip } from './shared.js';
const STEPS = ['Create a free project at supabase.com.', 'Open SQL Editor, paste the contents of supabase/setup.sql and run it. It creates the tables, the “media” image bucket and the security rules.',
  `Open Authentication > Users > Add user, and create a login (for example ${C.EMAIL}) with a password.`, 'Open Project Settings > API and copy the Project URL and the anon public key.',
  'Paste both into js/config.js (SUPABASE_URL and SUPABASE_ANON_KEY), redeploy, then sign in here with the email and password.'];
export const settingsPage = store => {
  const out = h('p', { class: 'soft small', role: 'status' });
  const run = async (label, fn) => { out.textContent = label + '…'; try { await fn(); out.textContent = label + ': done ✓'; } catch (e) { out.textContent = `${label} failed: ${e.message}`; } };
  return h('div', {}, AHead('Admin · Settings', 'Connection'),
    h('div', { class: 'panel' }, h('div', { class: 'row-between' }, h('h3', {}, remote ? 'Connected to Supabase' : 'Local demo mode'), chip(remote ? 'Live' : 'This device only', remote ? 'teal' : 'amber')),
      remote ? h('div', {}, h('p', { class: 'soft' }, `Project: ${C.SUPABASE_URL}`), h('p', { class: 'soft' }, `Signed in as ${session()?.email || '—'}`),
        h('div', { class: 'row-actions' },
          h('button', { class: 'btn', type: 'button', onClick: () => run('Connection test', ping) }, 'Test connection'),
          h('button', { class: 'btn', type: 'button', onClick: () => run('Publishing the catalogue', () => publishNow(store)) }, 'Publish catalogue now')),
        out)
        : h('div', {}, h('p', { class: 'soft' }, 'Prices, rooms, photos and requests are saved in this browser only, so visitors on other devices will not see your changes and guest requests will not reach you here. Connect Supabase to go live.'),
          h('div', { class: 'row-actions' }, h('button', { class: 'btn', type: 'button', onClick: () => confirm('Reset everything in this browser back to the starting data?') && (store.set(structuredClone(SEED)), toast('Reset')) }, 'Reset demo data')))),
    !remote && h('div', { class: 'panel gap-top' }, h('h3', {}, 'Connect Supabase (about 10 minutes)'), h('ol', { class: 'steps-list' }, STEPS.map(t => h('li', {}, t))),
      h('div', { class: 'row-actions' }, h('button', { class: 'btn', type: 'button', onClick: async () => { try { await navigator.clipboard.writeText(await (await fetch('supabase/setup.sql')).text()); toast('SQL copied'); } catch { toast('Open supabase/setup.sql in the project'); } } }, 'Copy setup SQL'))));
};
