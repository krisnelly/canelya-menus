// ── COMPOSANT — ÉTAPE 1 : CLIENT & ÉVÉNEMENT ──────────────────────────────────
// Toute modification du formulaire client (champs, validation visuelle) se
// fait UNIQUEMENT ici. Ne touche pas à la logique de génération.

import { CLIENTS } from "../data/clients";

export default function EtapeClient({ form, upd }) {
  return (
    <div className="card">
      <div className="ct">🏢 Client & Evenement</div>
      <div className="g2" style={{ marginBottom: 14 }}>
        <div>
          <label>Client</label>
          <select value={form.clientId} onChange={e => upd("clientId", e.target.value)}>
            <option value="">Selectionner...</option>
            {CLIENTS.map(c => <option key={c.id} value={c.id}>{c.nom}</option>)}
          </select>
        </div>
        <div>
          <label>Nombre de personnes</label>
          <input type="number" min="1" value={form.nombrePersonnes} onChange={e => upd("nombrePersonnes", Number(e.target.value))} />
        </div>
      </div>

      {form.clientId === "autre" && (
        <div style={{ marginBottom: 14 }}>
          <label>Nom du client</label>
          <input type="text" value={form.clientAutre} onChange={e => upd("clientAutre", e.target.value)} placeholder="Nom du client..." />
        </div>
      )}

      <div style={{ marginBottom: 14 }}>
        <label>Nom de l'evenement</label>
        <input type="text" value={form.nomEvenement} onChange={e => upd("nomEvenement", e.target.value)} placeholder="Ex: Seminaire annuel..." />
      </div>

      <div style={{ marginBottom: 14 }}>
        <label>Date de debut de l'evenement</label>
        <input type="date" value={form.dateDebut} onChange={e => upd("dateDebut", e.target.value)} />
      </div>

      <div style={{ marginBottom: 14 }}>
        <label>⚡ Produits a ecouler (prioritaires dans le menu)</label>
        <input type="text" value={form.produitsAEcouler} onChange={e => upd("produitsAEcouler", e.target.value)} placeholder="Ex: boeuf, blanc de poulet, tilapia..." />
      </div>

      <div>
        <label style={{ color: "#e88888" }}>🚫 Produits en rupture de stock (exclus du menu)</label>
        <input
          type="text"
          value={form.ruptureStock}
          onChange={e => upd("ruptureStock", e.target.value)}
          placeholder="Ex: tilapia, poulet, mangue..."
          style={{ borderColor: form.ruptureStock ? "#e88888" : "" }}
        />
      </div>

      {form.nombrePersonnes > 0 && (
        <div className="inf" style={{ marginTop: 14, marginBottom: 0 }}>
          Mode de service : <strong style={{ color: "#a8d8b8" }}>
            {form.nombrePersonnes > 5 ? "Buffet — plusieurs choix" : "Parts individuelles — 1 choix"}
          </strong>
        </div>
      )}
    </div>
  );
}

// Validation pour autoriser le passage à l'étape suivante
export function canNextEtapeClient(form) {
  return Boolean(
    form.clientId &&
    (form.clientId !== "autre" || form.clientAutre) &&
    form.nomEvenement &&
    form.dateDebut &&
    form.nombrePersonnes > 0
  );
}
