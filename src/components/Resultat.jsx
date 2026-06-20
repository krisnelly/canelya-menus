// ── COMPOSANT — PAGE RÉSULTAT COMPLÈTE ────────────────────────────────────────
// Assemble l'en-tête, le tableau menu éditable et les panneaux devis/planning.
// Toute modification de la mise en page générale du résultat se fait ici ;
// les sous-parties (tableau, panneaux) se modifient dans leurs fichiers dédiés.

import TableauMenu from "./TableauMenu";
import PanneauResultat from "./PanneauResultat";

export default function Resultat({ entry, onCopierWord, onRegenJour, onSaveEdit }) {
  if (!entry) return <div className="empty">Aucun evenement genere</div>;
  const e = entry;

  return (
    <div>
      <div className="rh">
        <div>
          <div className="rt">{e.clientNom} — {e.nomEvenement}</div>
          <div className="rs">
            {e.dateDebut} · {e.nombrePersonnes} pers. · {e.service} · {e.typeEvenement}
            {e.produitsAEcouler && <span className="tag-p">⚡ {e.produitsAEcouler}</span>}
            {e.ruptureStock && <span className="tag-a">🚫 {e.ruptureStock}</span>}
            {e.alcool && <span className="tag-a">🍷 Alcool</span>}
          </div>
        </div>
        <button className="btn-copy" onClick={() => onCopierWord(e)}>📋 Copier pour Word</button>
      </div>

      <TableauMenu entry={e} onRegenJour={onRegenJour} onSaveEdit={onSaveEdit} />
      <PanneauResultat entry={e} />

      {e.equipe.retroplanning && <div className="warn">⚠️ Retroplanning requis — preparation J-2 et J-1.</div>}
    </div>
  );
}
