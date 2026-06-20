// ── COMPOSANT — PANNEAU DEVIS, PLANNING & ÉQUIPE ──────────────────────────────
// Toute modification de l'affichage du résultat (hors tableau menu) se fait
// UNIQUEMENT ici.

export default function PanneauResultat({ entry }) {
  const e = entry;
  return (
    <div className="g2">
      <div className="card">
        <div className="ct">💰 Devis — {e.numeroDevis}</div>
        {e.devis.lignes.map((l, i) => (
          <div key={i} className="kv">
            <span className="kv-k">{l.designation} × {l.qte}</span>
            <span className="kv-v">{(l.qte * l.pu).toLocaleString("fr-FR")} FCFA</span>
          </div>
        ))}
        <div className="kv"><span className="kv-k">Sous-total HT</span><span className="kv-v">{e.devis.totalHT.toLocaleString("fr-FR")} FCFA</span></div>
        <div className="kv"><span className="kv-k">TVA 18%</span><span className="kv-v">{e.devis.tva.toLocaleString("fr-FR")} FCFA</span></div>
        <div className="kv" style={{ paddingTop: 8 }}>
          <span style={{ fontWeight: 700, color: "#c8a96e" }}>TOTAL TTC</span>
          <span style={{ fontWeight: 700, color: "#c8a96e", fontSize: 15 }}>{e.devis.totalTTC.toLocaleString("fr-FR")} FCFA</span>
        </div>
      </div>

      <div>
        <div className="card" style={{ marginBottom: 14 }}>
          <div className="ct">🚗 Planning</div>
          <div className="kv"><span className="kv-k">Depart logistique</span><span className="kv-v" style={{ color: "#e8a870" }}>{e.planning.hLogistique}</span></div>
          {(e.planning.hDepartPrestations || []).map((p, i) => (
            <div key={i} className="kv">
              <span className="kv-k">{p.label} ({p.hPresta})</span>
              <span className="kv-v" style={{ color: "#e8a870" }}>Dep. {p.hDepart}</span>
            </div>
          ))}
          <div className="kv"><span className="kv-k">Limite achat</span><span className="kv-v" style={{ color: "#e88888", fontSize: 11 }}>{e.planning.dateLimiteAchat}</span></div>
        </div>
        <div className="card">
          <div className="ct">👥 Equipe</div>
          {[
            ["Sup. terrain", e.superviseurTerrain],
            ["Sup. cuisine", e.superviseurCuisine],
            ["Serveurs", e.equipe.nbServeurs],
            ["Cuisiniers", e.equipe.nbCuisiniers],
            ["Chauffeurs", e.equipe.nbChauffeurs],
            ["Dress code", e.dresscode],
          ].map(([k, v]) => (
            <div key={k} className="kv"><span className="kv-k">{k}</span><span className="kv-v">{v}</span></div>
          ))}
        </div>
      </div>
    </div>
  );
}
