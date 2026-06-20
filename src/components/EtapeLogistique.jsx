// ── COMPOSANT — ÉTAPE 3 : LOGISTIQUE ──────────────────────────────────────────
// Toute modification du formulaire logistique se fait UNIQUEMENT ici.

import { heureDepart } from "../logic/utils";

export default function EtapeLogistique({ form, upd }) {
  return (
    <>
      <div className="card">
        <div className="ct">📍 Logistique</div>
        <div className="g2" style={{ marginBottom: 14 }}>
          <div>
            <label>Lieu</label>
            <div style={{ display: "flex", gap: 8, marginTop: 6 }}>
              {["Interne", "Externe"].map(t => (
                <button key={t} className={"pb" + (form.typeEvenement === t ? " on" : "")} onClick={() => upd("typeEvenement", t)}>
                  <em>{t === "Interne" ? "🏠" : "🚗"}</em>{t}
                </button>
              ))}
            </div>
          </div>
          <div>
            <label>Distance (km)</label>
            <input type="number" min="0" value={form.distanceKm} onChange={e => upd("distanceKm", Number(e.target.value))} disabled={form.typeEvenement === "Interne"} />
          </div>
        </div>
        <div className="g2">
          <div>
            <label>Cuisson sur place</label>
            <div style={{ display: "flex", gap: 8, marginTop: 6 }}>
              {[{ v: false, l: "Non", i: "❌" }, { v: true, l: "Oui", i: "🔥" }].map(({ v, l, i }) => (
                <button key={l} className={"pb" + (form.cuissonSurPlace === v ? " on" : "")} onClick={() => upd("cuissonSurPlace", v)}><em>{i}</em>{l}</button>
              ))}
            </div>
          </div>
          <div>
            <label>Evenement sensible</label>
            <div style={{ display: "flex", gap: 8, marginTop: 6 }}>
              {[{ v: false, l: "Non", i: "✅" }, { v: true, l: "Oui", i: "⚠️" }].map(({ v, l, i }) => (
                <button key={l} className={"pb" + (form.sensible === v ? " on" : "")} onClick={() => upd("sensible", v)}><em>{i}</em>{l}</button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {form.typeEvenement === "Externe" && (
        <div className="inf">
          Depart logistique : <strong style={{ color: "#a8d8b8" }}>
            {heureDepart(form.pMatin ? form.hMatin : form.pDej ? form.hDej : form.hCocktailDin, form.cuissonSurPlace ? 6 : 3)}
          </strong>
          {"  (H-" + (form.cuissonSurPlace ? "6h" : "3h") + ")"}
        </div>
      )}
      {form.nombrePersonnes >= 200 && <div className="warn">⚠️ Plus de 200 personnes — retroplanning J-2/J-1 necessaire.</div>}
    </>
  );
}
