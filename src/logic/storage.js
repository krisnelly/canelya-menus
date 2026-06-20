// ── PERSISTANCE — HISTORIQUE DES ÉVÉNEMENTS ───────────────────────────────────
// Toute modification de la source de persistance (API, clé de stockage) se
// fait UNIQUEMENT ici. Le reste de l'app ne connaît que loadHistory/saveHistory
// /addEvent/updateEvent/deleteEvent.
//
// Implémentation : appelle l'API serverless /api/menus, qui lit/écrit dans la
// base MySQL (canelyac_gen). Voir /api/menus.js et /api/schema.sql.

const API_BASE = "/api/menus";

export async function loadHistory() {
  try {
    const r = await fetch(API_BASE);
    if (!r.ok) throw new Error("Erreur API loadHistory");
    return await r.json();
  } catch (err) {
    console.error("loadHistory:", err);
    return [];
  }
}

// Ajoute un nouvel événement en base
export async function addEvent(entry) {
  try {
    const r = await fetch(API_BASE, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(entry),
    });
    if (!r.ok) throw new Error("Erreur API addEvent");
    return true;
  } catch (err) {
    console.error("addEvent:", err);
    return false;
  }
}

// Met à jour un événement existant (édition cellule, régénération jour)
export async function updateEvent(entry) {
  try {
    const r = await fetch(`${API_BASE}?id=${entry.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(entry),
    });
    if (!r.ok) throw new Error("Erreur API updateEvent");
    return true;
  } catch (err) {
    console.error("updateEvent:", err);
    return false;
  }
}

// Supprime un événement de l'historique
export async function deleteEvent(id) {
  try {
    const r = await fetch(`${API_BASE}?id=${id}`, { method: "DELETE" });
    if (!r.ok) throw new Error("Erreur API deleteEvent");
    return true;
  } catch (err) {
    console.error("deleteEvent:", err);
    return false;
  }
}

// Conservé pour compatibilité : sauvegarde l'historique complet en
// déterminant automatiquement add/update/delete par diff n'est pas
// nécessaire ici — App.jsx appelle désormais directement
// addEvent/updateEvent/deleteEvent au bon moment (voir App.jsx).
