// ── COMPOSANT — TABLEAU MENU ÉDITABLE ─────────────────────────────────────────
// Toute modification de l'affichage du tableau ou de l'interaction d'édition
// se fait UNIQUEMENT ici. La logique de génération (buildRows) vit dans
// logic/genererMenu.js.

import { useState } from "react";
import { buildRows } from "../logic/genererMenu";

const SEC_TO_KEY = {
  "☕ Pause cafe Matin": "matin",
  "🍽️ Dejeuner": "dejeuner",
  "🌅 Pause cafe Apres-midi": "apm",
  "🥂 Cocktail Dejeunatoire": "cocktailDej",
  "🍷 Cocktail Dinatoire": "cocktailDin",
};
const FIELD_MAP = {
  "Sucres": "sucres", "Sales": "sales", "Fruits": "fruits", "The/Lait/Cafe": "chauds",
  "Bouillie": "bouillie", "Boisson froide": "boisson", "Boisson": "boisson",
  "Entree": "entree", "Proteine(s)": "proteines", "Accomp.": "accomp",
  "Dessert": "dessert", "Boissons": "boissons",
};

export default function TableauMenu({ entry, onRegenJour, onSaveEdit }) {
  const [editCell, setEditCell] = useState(null);
  const [editVal, setEditVal] = useState("");

  const jo = entry.jours;
  const rows = buildRows(entry);

  const startEdit = (cellKey, value) => {
    setEditCell(cellKey);
    setEditVal(String(value || ""));
  };

  const confirmEdit = (jour, rowSub, ridx) => {
    let sec = null;
    for (let i = ridx; i >= 0; i--) {
      if (rows[i].sec) { sec = rows[i].sec; break; }
    }
    const pKey = SEC_TO_KEY[sec];
    const field = FIELD_MAP[rowSub];
    if (!pKey || !field) return;
    onSaveEdit(jour, pKey, field, editVal);
    setEditCell(null);
  };

  return (
    <div className="card" style={{ padding: 0, overflow: "hidden", marginBottom: 16 }}>
      <div style={{ padding: "12px 18px", borderBottom: "1px solid #2a2520", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <span style={{ fontFamily: "Playfair Display,serif", color: "#c8a96e", fontSize: 14 }}>📋 Menu</span>
        <span style={{ fontSize: 11, color: "#7a6e5f" }}>💡 Cliquez sur une cellule pour modifier</span>
      </div>
      <div className="tw" style={{ border: "none", borderRadius: 0 }}>
        <table className="mt">
          <thead>
            <tr>
              <th className="l" style={{ width: "16%" }}>Prestation</th>
              <th className="l" style={{ width: "12%" }}>Detail</th>
              {jo.map(j => (
                <th key={j}>
                  {j}
                  {entry.menus[j]?.dejeuner?.isLundi && (
                    <span style={{ display: "block", fontSize: 9, color: "#c8a96e", fontWeight: "normal" }}>🤝 Partenaire</span>
                  )}
                  <button className="regen-j" onClick={() => onRegenJour(j)}>🔄 Regénérer</button>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((row, ridx) => (
              <tr key={ridx}>
                {row.sec && <td className="sec" rowSpan={row.span}>{row.sec}</td>}
                <td className="sub">{row.sub}</td>
                {jo.map(j => {
                  const val = row.fn(entry.menus[j] || {});
                  const ck = j + "|" + ridx;
                  const isEd = editCell === ck;
                  return (
                    <td
                      key={j}
                      className={isEd ? "editing" : "val"}
                      onClick={!isEd ? () => startEdit(ck, val) : undefined}
                    >
                      {isEd ? (
                        <>
                          <textarea className="cell-ta" value={editVal} onChange={ev => setEditVal(ev.target.value)} autoFocus rows={2} />
                          <div className="cell-acts">
                            <button className="btn-x" onClick={() => setEditCell(null)}>✕</button>
                            <button className="btn-ok" onClick={() => confirmEdit(j, row.sub, ridx)}>✓ OK</button>
                          </div>
                        </>
                      ) : val}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
