// ── COMPOSANT — ÉTAPE 4 : ÉQUIPE & DRESS CODE ─────────────────────────────────
// Toute modification du formulaire équipe se fait UNIQUEMENT ici.
// L'aperçu du calcul d'équipe utilise logic/calculEquipe.js (source unique).

import { SUPERVISEURS, DRESSCODES } from "../data/clients";
import { calculEquipe } from "../logic/calculEquipe";

export default function EtapeEquipe({ form, upd }) {
  const apercu = calculEquipe(form.nombrePersonnes, form.distanceKm);

  return (
    <>
      <div className="card">
        <div className="ct">👥 Equipe & Dress code</div>
        <div className="g3">
          <div>
            <label>Superviseur terrain</label>
            <select value={form.superviseurTerrain} onChange={e => upd("superviseurTerrain", e.target.value)}>
              {SUPERVISEURS.map(s => <option key={s}>{s}</option>)}
            </select>
          </div>
          <div>
            <label>Superviseur cuisine</label>
            <select value={form.superviseurCuisine} onChange={e => upd("superviseurCuisine", e.target.value)}>
              {SUPERVISEURS.map(s => <option key={s}>{s}</option>)}
            </select>
          </div>
          <div>
            <label>Dress code</label>
            <select value={form.dresscode} onChange={e => upd("dresscode", e.target.value)}>
              {DRESSCODES.map(d => <option key={d}>{d}</option>)}
            </select>
          </div>
        </div>
      </div>
      <div className="inf">
        <strong>Equipe calculee :</strong>{"  "}
        {apercu.nbServeurs} serveur(s) ·{" "}
        {apercu.nbCuisiniers} cuisinier(s) ·{" "}
        {apercu.nbChauffeurs} chauffeur(s)
      </div>
    </>
  );
}
