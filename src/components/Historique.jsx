// ── COMPOSANT — HISTORIQUE ─────────────────────────────────────────────────────
// Toute modification de l'affichage de l'historique se fait UNIQUEMENT ici.

export default function Historique({ hist, onVoir, onCopierWord, onSupprimer }) {
  return (
    <div className="card">
      <div className="ct">🕐 Historique</div>
      {hist.length === 0 ? (
        <div className="empty">Aucun evenement</div>
      ) : (
        hist.map(h => (
          <div key={h.id} className="hi">
            <div>
              <span className="hic">{h.clientNom}</span>
              <span style={{ color: "#f5f0e8", marginLeft: 10 }}>{h.nomEvenement}</span>
              <div className="hid">{h.dateDebut} · {h.nombrePersonnes} pers. · {h.service} · {h.typeEvenement}</div>
            </div>
            <div style={{ display: "flex", gap: 8 }}>
              <button className="btn-s" onClick={() => onVoir(h)}>Voir</button>
              <button className="btn-s" onClick={() => onCopierWord(h)}>📋</button>
              <button className="btn-del" onClick={() => onSupprimer(h.id)}>Suppr.</button>
            </div>
          </div>
        ))
      )}
    </div>
  );
}
