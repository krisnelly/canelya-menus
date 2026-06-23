// ── API — CRUD ÉVÉNEMENTS ─────────────────────────────────────────────────────
// GET    /api/menus            → liste tous les événements (historique)
// POST   /api/menus            → crée un nouvel événement (body = objet entry)
// PUT    /api/menus?id=123     → met à jour un événement existant (édition cellule, régénération jour)
// DELETE /api/menus?id=123     → supprime un événement
//
// Toute modification du schéma de la table `evenements` se fait UNIQUEMENT ici
// et dans le script SQL de création de table fourni séparément.

import { getPool } from "./_db.js";

export default async function handler(req, res) {
  const pool = getPool();

  try {
    if (req.method === "GET") {
      const [rows] = await pool.query("SELECT data FROM evenements ORDER BY created_at DESC");
      // La colonne `data` peut être de type JSON (mysql2 renvoie déjà un objet)
      // ou TEXT (mysql2 renvoie une chaîne à parser). On gère les deux, et on
      // ignore une ligne corrompue au lieu de faire échouer toute la liste.
      const hist = rows
        .map(r => {
          try {
            return typeof r.data === "string" ? JSON.parse(r.data) : r.data;
          } catch (e) {
            console.error("Ligne evenement illisible, ignoree:", e.message);
            return null;
          }
        })
        .filter(Boolean);
      return res.status(200).json(hist);
    }

    if (req.method === "POST") {
      const entry = req.body;
      if (!entry || !entry.id) return res.status(400).json({ error: "Champ 'id' manquant dans l'evenement." });
      await pool.query(
        "INSERT INTO evenements (event_id, client_id, data, created_at) VALUES (?, ?, ?, NOW())",
        [entry.id, entry.clientId || null, JSON.stringify(entry)]
      );
      return res.status(201).json({ ok: true });
    }

    if (req.method === "PUT") {
      const { id } = req.query;
      const entry = req.body;
      if (!id) return res.status(400).json({ error: "Parametre 'id' manquant." });
      await pool.query(
        "UPDATE evenements SET data = ? WHERE event_id = ?",
        [JSON.stringify(entry), id]
      );
      return res.status(200).json({ ok: true });
    }

    if (req.method === "DELETE") {
      const { id } = req.query;
      if (!id) return res.status(400).json({ error: "Parametre 'id' manquant." });
      await pool.query("DELETE FROM evenements WHERE event_id = ?", [id]);
      return res.status(200).json({ ok: true });
    }

    res.setHeader("Allow", ["GET", "POST", "PUT", "DELETE"]);
    return res.status(405).json({ error: "Methode non autorisee." });
  } catch (err) {
    console.error("Erreur API /api/menus :", err);
    return res.status(500).json({ error: "Erreur serveur", detail: err.message });
  }
}
