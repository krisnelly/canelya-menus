// ── COMPOSANT — ONGLET CONFIGURATION (catalogue enrichi) ─────────────────────
// Permet d'ajouter / modifier / supprimer des items dans les catégories
// « listes simples ». Les items ajoutés sont proposés aux prochaines
// générations ET correctement chiffrés dans la fiche d'achat (via fournisseur
// + prix + portion). Ne touche à AUCUNE règle métier.

import { useState } from "react";
import { CATEGORIES_CUSTOM, FOURNISSEURS_CUSTOM, labelCategorie, labelFournisseur } from "../data/categoriesCustom";

const VIDE = { category: "MATIN_SUCRES_BLE", nom: "", fournisseur: "SUPERMARCHE", prix: "", portion: "" };

export default function Configuration({ items, onAdd, onUpdate, onDelete }) {
  const [f, setF] = useState(VIDE);
  const [editId, setEditId] = useState(null);
  const [busy, setBusy] = useState(false);

  const upd = (k, v) => {
    if (k === "category") {
      // Pré-remplit le fournisseur conseillé pour la catégorie choisie
      const c = CATEGORIES_CUSTOM.find(x => x.key === v);
      setF(p => ({ ...p, category: v, fournisseur: c ? c.four : p.fournisseur }));
    } else {
      setF(p => ({ ...p, [k]: v }));
    }
  };

  const reset = () => { setF(VIDE); setEditId(null); };

  const valider = async () => {
    if (!f.nom.trim()) { alert("Le nom de l'item est obligatoire."); return; }
    setBusy(true);
    const payload = {
      id: editId || Date.now(),
      category: f.category,
      nom: f.nom.trim(),
      fournisseur: f.fournisseur,
      prix: f.prix === "" || f.prix == null ? null : Number(f.prix),
      portion: f.portion.trim(),
    };
    try {
      if (editId) await onUpdate(payload);
      else await onAdd(payload);
      reset();
    } finally {
      setBusy(false);
    }
  };

  const editer = it => {
    setEditId(it.id);
    setF({
      category: it.category,
      nom: it.nom,
      fournisseur: it.fournisseur,
      prix: it.prix == null ? "" : String(it.prix),
      portion: it.portion || "",
    });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Regroupe les items par catégorie pour l'affichage
  const parCategorie = {};
  (items || []).forEach(it => (parCategorie[it.category] = parCategorie[it.category] || []).push(it));

  return (
    <div>
      <div className="card">
        <div className="ct">⚙️ {editId ? "Modifier l'item" : "Ajouter un item au catalogue"}</div>

        <div className="inf">
          Les items ajoutés ici enrichissent la base : ils seront proposés lors des prochaines générations
          de menus et chiffrés dans la fiche d'achat. (Protéines &amp; accompagnements : étape ultérieure.)
        </div>

        <div className="g2">
          <div>
            <label>Catégorie</label>
            <select value={f.category} onChange={e => upd("category", e.target.value)}>
              {CATEGORIES_CUSTOM.map(c => <option key={c.key} value={c.key}>{c.label}</option>)}
            </select>
          </div>
          <div>
            <label>Nom de l'item</label>
            <input type="text" value={f.nom} onChange={e => upd("nom", e.target.value)} placeholder="Ex. Mini cake coco" />
          </div>
        </div>

        <div className="g3" style={{ marginTop: 14 }}>
          <div>
            <label>Fournisseur (fiche d'achat)</label>
            <select value={f.fournisseur} onChange={e => upd("fournisseur", e.target.value)}>
              {FOURNISSEURS_CUSTOM.map(x => <option key={x.key} value={x.key}>{x.label}</option>)}
            </select>
          </div>
          <div>
            <label>Prix / pers (FCFA) — optionnel</label>
            <input type="number" value={f.prix} onChange={e => upd("prix", e.target.value)} placeholder="Ex. 200 (vide = Variable)" />
          </div>
          <div>
            <label>Portion / note — optionnel</label>
            <input type="text" value={f.portion} onChange={e => upd("portion", e.target.value)} placeholder="Ex. 1/pers" />
          </div>
        </div>

        <div className="row-btns">
          {editId && <button className="btn-n" onClick={reset} disabled={busy}>Annuler</button>}
          <button className="btn-g" style={{ width: "auto", padding: "11px 28px" }} onClick={valider} disabled={busy}>
            {busy ? "⏳..." : editId ? "💾 Enregistrer les modifications" : "➕ Ajouter au catalogue"}
          </button>
        </div>
      </div>

      <div className="card">
        <div className="ct">📚 Catalogue enrichi {items && items.length > 0 && <span className="bdg">{items.length}</span>}</div>
        {!items || items.length === 0 ? (
          <div className="empty">Aucun item custom pour l'instant. Ajoutez-en un ci-dessus.</div>
        ) : (
          CATEGORIES_CUSTOM.filter(c => parCategorie[c.key]).map(c => (
            <div key={c.key} style={{ marginBottom: 14 }}>
              <div className="rs" style={{ marginBottom: 6 }}>{c.label}</div>
              {parCategorie[c.key].map(it => (
                <div key={it.id} className="hi">
                  <div>
                    <span className="hic">{it.nom}</span>
                    <div className="hid">
                      {labelFournisseur(it.fournisseur)}
                      {it.prix != null ? ` · ${Number(it.prix).toLocaleString("fr-FR")} FCFA/pers` : " · Prix variable"}
                      {it.portion ? ` · ${it.portion}` : ""}
                    </div>
                  </div>
                  <div style={{ display: "flex", gap: 8 }}>
                    <button className="btn-s" onClick={() => editer(it)}>Modifier</button>
                    <button className="btn-del" onClick={() => onDelete(it.id)}>Suppr.</button>
                  </div>
                </div>
              ))}
            </div>
          ))
        )}
      </div>
    </div>
  );
}
