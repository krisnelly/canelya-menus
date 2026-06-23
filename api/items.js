// ── API — CRUD ITEMS CUSTOM (catalogue enrichi) ──────────────────────────────
// GET    /api/items          → liste tous les items custom
// POST   /api/items          → ajoute un item (body = {id, category, nom, fournisseur, prix, portion})
// PUT    /api/items?id=123    → met à jour un item
// DELETE /api/items?id=123    → supprime un item
//
// La table est créée automatiquement au premier appel (CREATE TABLE IF NOT
// EXISTS) — aucune action SQL manuelle nécessaire.

import { getPool } from "./_db.js";

const CREATE_TABLE = `
  CREATE TABLE IF NOT EXISTS items_custom (
    id          BIGINT       PRIMARY KEY,
    category    VARCHAR(40)  NOT NULL,
    nom         VARCHAR(160) NOT NULL,
    fournisseur VARCHAR(20)  NOT NULL,
    prix        INT          NULL,
    portion     VARCHAR(160) NULL,
    created_at  DATETIME     NOT NULL
  )`;

export default async function handler(req, res) {
  const pool = getPool();
  try {
    await pool.query(CREATE_TABLE); // idempotent

    if (req.method === "GET") {
      const [rows] = await pool.query(
        "SELECT id, category, nom, fournisseur, prix, portion FROM items_custom ORDER BY category, nom"
      );
      return res.status(200).json(rows);
    }

    if (req.method === "POST") {
      const e = req.body;
      if (!e || !e.id || !e.category || !e.nom || !e.fournisseur)
        return res.status(400).json({ error: "Champs requis manquants (id, category, nom, fournisseur)." });
      await pool.query(
        "INSERT INTO items_custom (id, category, nom, fournisseur, prix, portion, created_at) VALUES (?, ?, ?, ?, ?, ?, NOW())",
        [e.id, e.category, e.nom, e.fournisseur, e.prix ?? null, e.portion || null]
      );
      return res.status(201).json({ ok: true });
    }

    if (req.method === "PUT") {
      const { id } = req.query;
      const e = req.body;
      if (!id) return res.status(400).json({ error: "Parametre 'id' manquant." });
      await pool.query(
        "UPDATE items_custom SET category = ?, nom = ?, fournisseur = ?, prix = ?, portion = ? WHERE id = ?",
        [e.category, e.nom, e.fournisseur, e.prix ?? null, e.portion || null, id]
      );
      return res.status(200).json({ ok: true });
    }

    if (req.method === "DELETE") {
      const { id } = req.query;
      if (!id) return res.status(400).json({ error: "Parametre 'id' manquant." });
      await pool.query("DELETE FROM items_custom WHERE id = ?", [id]);
      return res.status(200).json({ ok: true });
    }

    res.setHeader("Allow", ["GET", "POST", "PUT", "DELETE"]);
    return res.status(405).json({ error: "Methode non autorisee." });
  } catch (err) {
    console.error("Erreur API /api/items :", err);
    return res.status(500).json({ error: "Erreur serveur", detail: err.message });
  }
}
