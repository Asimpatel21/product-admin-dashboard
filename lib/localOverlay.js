// DummyJSON's add/edit/delete endpoints respond with a "success" payload but
// never actually change their database - the same GET call afterwards
// returns the old data. So we keep a small "overlay" in localStorage that
// records what the user has done, and re-apply it on top of every list we
// fetch from the API. This way the app *behaves* like the changes were saved,
// even though the backend itself is read-only.
const KEY = 'product_overlay_v1';

function readOverlay() {
  if (typeof window === 'undefined') return { added: [], edited: {}, deleted: [] };
  try {
    const raw = localStorage.getItem(KEY);
    return raw ? JSON.parse(raw) : { added: [], edited: {}, deleted: [] };
  } catch {
    return { added: [], edited: {}, deleted: [] };
  }
}

function writeOverlay(overlay) {
  localStorage.setItem(KEY, JSON.stringify(overlay));
}

export function getOverlay() {
  return readOverlay();
}

export function addLocalProduct(product) {
  const overlay = readOverlay();
  const localProduct = { ...product, id: Date.now(), isLocal: true };
  overlay.added.unshift(localProduct);
  writeOverlay(overlay);
  return localProduct;
}

export function editLocalProduct(id, data) {
  const overlay = readOverlay();
  const addedIndex = overlay.added.findIndex((p) => String(p.id) === String(id));
  if (addedIndex !== -1) {
    overlay.added[addedIndex] = { ...overlay.added[addedIndex], ...data };
  } else {
    overlay.edited[id] = { ...(overlay.edited[id] || {}), ...data };
  }
  writeOverlay(overlay);
}

export function deleteLocalProduct(id) {
  const overlay = readOverlay();
  overlay.added = overlay.added.filter((p) => String(p.id) !== String(id));
  delete overlay.edited[id];
  if (!overlay.deleted.includes(Number(id))) {
    overlay.deleted.push(Number(id));
  }
  writeOverlay(overlay);
}

export function applyOverlay(products) {
  const overlay = readOverlay();
  const result = products
    .filter((p) => !overlay.deleted.includes(p.id))
    .map((p) => (overlay.edited[p.id] ? { ...p, ...overlay.edited[p.id] } : p));
  return [...overlay.added, ...result];
}
