import { remote, uploadFile, deleteFile, pathOf } from './backend.js';
// Resize in the browser first (phone photos are often 5 MB+), then upload to Supabase Storage.
// Local demo mode keeps a small data: URL instead, so the admin still works without a backend.
export async function prepareImage(file, { max = 1600, q = 0.85 } = {}) {
  const bmp = await createImageBitmap(file), s = Math.min(1, max / Math.max(bmp.width, bmp.height));
  const c = document.createElement('canvas'); c.width = Math.round(bmp.width * s); c.height = Math.round(bmp.height * s);
  c.getContext('2d').drawImage(bmp, 0, 0, c.width, c.height);
  return new Promise((res, rej) => c.toBlob(b => (b ? res(b) : rej(new Error('Could not read that image'))), 'image/jpeg', q));
}
const toDataUrl = blob => new Promise(r => { const f = new FileReader(); f.onload = () => r(f.result); f.readAsDataURL(blob); });
export async function saveImage(file, folder) {
  const blob = await prepareImage(file, remote ? {} : { max: 900, q: 0.72 });
  return remote ? uploadFile(`${folder}/${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 7)}.jpg`, blob) : toDataUrl(blob);
}
export const removeImage = async url => { if (remote && pathOf(url)) await deleteFile(url).catch(() => {}); };
