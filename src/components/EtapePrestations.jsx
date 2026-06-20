// ── COMPOSANT — ÉTAPE 2 : JOURS & PRESTATIONS ─────────────────────────────────
// Toute modification de la liste des prestations ou de leur affichage se fait
// UNIQUEMENT ici.

import { JOURS } from "../data/clients";

export const PREST_DEF = [
  { k: "pMatin",       h: "hMatin",       l: "Pause cafe matin",      i: "☕" },
  { k: "pDej",         h: "hDej",         l: "Dejeuner",              i: "🍽️" },
  { k: "pApm",         h: "hApm",         l: "Pause cafe apres-midi", i: "🌅" },
  { k: "pCocktailDej", h: "hCocktailDej", l: "Cocktail dejeunatoire", i: "🥂" },
  { k: "pCocktailDin", h: "hCocktailDin", l: "Cocktail dinatoire",    i: "🍷" },
];

export default function EtapePrestations({ form, upd, togJ }) {
  return (
    <>
      <div className="card">
        <div className="ct">📅 Jours de prestation</div>
        <div className="jg">
          {JOURS.map(j => (
            <button key={j} className={"jb" + (form.jours.includes(j) ? " on" : "")} onClick={() => togJ(j)}>{j}</button>
          ))}
        </div>
      </div>

      <div className="card">
        <div className="ct">🕐 Prestations & heures</div>
        {PREST_DEF.map(({ k, h, l, i }) => (
          <div key={k} className="prest-row">
            <button className={"prest-btn" + (form[k] ? " on" : "")} onClick={() => upd(k, !form[k])}>
              <em>{i}</em>{l}
            </button>
            {form[k] ? (
              <div style={{ display: "flex", alignItems: "center", gap: 10, flex: 1 }}>
                <div>
                  <label>Heure</label>
                  <input type="time" value={form[h]} onChange={e => upd(h, e.target.value)} style={{ width: 130 }} />
                </div>
                {k === "pCocktailDin" && (
                  <div>
                    <label>Alcool</label>
                    <div style={{ display: "flex", gap: 8, marginTop: 6 }}>
                      {[{ v: false, l: "Non" }, { v: true, l: "Oui" }].map(({ v, l }) => (
                        <button key={l} className={"pb" + (form.alcool === v ? " on" : "")} style={{ padding: "6px 14px", width: "auto" }} onClick={() => upd("alcool", v)}>{l}</button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ) : <span style={{ color: "#3a3530", fontSize: 12 }}>Non selectionnee</span>}
          </div>
        ))}
      </div>
    </>
  );
}

export function canNextEtapePrestations(form) {
  return form.jours.length > 0 && PREST_DEF.some(p => form[p.k]);
}
