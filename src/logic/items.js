// ── PERSISTANCE — ITEMS CUSTOM (catalogue enrichi) ───────────────────────────
// Appelle l'API serverless /api/items (table items_custom, base MySQL).
// Mêmes principes que storage.js. Toute modif de la source se fait ici.

const API = "/api/items";

export async function loadItems() {
  try {
    const r = await fetch(API, { cache: "no-store" });
    if (!r.ok) throw new Error("loadItems: " + r.status);
    const data = await r.json();
    return Array.isArray(data) ? data : [];
  } catch (err) {
    console.error("loadItems:", err);
    return [];
  }
}

export async function addItem(item) {
  try {
    const r = await fetch(API, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(item),
    });
    if (!r.ok) throw new Error("addItem: " + r.status);
    return true;
  } catch (err) {
    console.error("addItem:", err);
    return false;
  }
}

export async function updateItem(item) {
  try {
    const r = await fetch(`${API}?id=${item.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(item),
    });
    if (!r.ok) throw new Error("updateItem: " + r.status);
    return true;
  } catch (err) {
    console.error("updateItem:", err);
    return false;
  }
}

export async function deleteItem(id) {
  try {
    const r = await fetch(`${API}?id=${id}`, { method: "DELETE" });
    if (!r.ok) throw new Error("deleteItem: " + r.status);
    return true;
  } catch (err) {
    console.error("deleteItem:", err);
    return false;
  }
}
