// ── COMPOSANT — PAGE RÉSULTAT COMPLÈTE ────────────────────────────────────────
// Assemble l'en-tête, le tableau menu éditable et les panneaux devis/planning.
// Toute modification de la mise en page générale du résultat se fait ici ;
// les sous-parties (tableau, panneaux) se modifient dans leurs fichiers dédiés.

import { useState } from "react";
import TableauMenu from "./TableauMenu";
import PanneauResultat from "./PanneauResultat";
import { genererRapportMenu, genererTousLesRapports } from "../logic/rapportMenu";

export default function Resultat({ entry, onCopierWord, onRegenJour, onSaveEdit }) {
  const [generatingMenu, setGeneratingMenu] = useState(false);
  const [generatingAll, setGeneratingAll] = useState(false);
  const [waLink, setWaLink] = useState(null);

  if (!entry) return <div className="empty">Aucun evenement genere</div>;
  const e = entry;

  const prepareWaLink = (label) => {
    const texte = encodeURIComponent(
      `${label} — ${e.clientNom} — ${e.nomEvenement}\n${e.dateDebut} | ${e.nombrePersonnes} pers.\n\nLe document a ete telecharge, je vous le joins ci-dessous.`
    );
    setWaLink(`https://wa.me/?text=${texte}`);
  };

  const handleGenererWord = async () => {
    setGeneratingMenu(true);
    setWaLink(null);
    try {
      await genererRapportMenu(e);
      prepareWaLink("Menu");
    } catch (err) {
      alert("❌ Erreur lors de la generation du document Word.");
      console.error(err);
    } finally {
      setGeneratingMenu(false);
    }
  };

  const handleGenererTout = async () => {
    setGeneratingAll(true);
    setWaLink(null);
    try {
      await genererTousLesRapports(e);
      prepareWaLink("Rapports complets (5 documents)");
    } catch (err) {
      alert("❌ Erreur lors de la generation des rapports.");
      console.error(err);
    } finally {
      setGeneratingAll(false);
    }
  };

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
        <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
          <button className="btn-copy" onClick={() => onCopierWord(e)}>📋 Copier pour Claude</button>
          <button className="btn-word" onClick={handleGenererWord} disabled={generatingMenu}>
            {generatingMenu ? "⏳ Generation..." : "📄 Menu (Word)"}
          </button>
          <button className="btn-word" style={{ background: "#a8801f" }} onClick={handleGenererTout} disabled={generatingAll}>
            {generatingAll ? "⏳ Generation des 5 rapports..." : "📦 Generer les 5 rapports"}
          </button>
          {waLink && (
            <a className="btn-wa" href={waLink} target="_blank" rel="noopener noreferrer">
              💬 Partager sur WhatsApp
            </a>
          )}
        </div>
      </div>

      {waLink && (
        <div className="inf">
          Le fichier vient d'etre telecharge sur votre appareil (dossier "Telechargements").
          Cliquez sur "Partager sur WhatsApp" pour ouvrir une conversation, puis joignez le fichier manuellement.
        </div>
      )}

      <TableauMenu entry={e} onRegenJour={onRegenJour} onSaveEdit={onSaveEdit} />
      <PanneauResultat entry={e} />

      {e.equipe.retroplanning && <div className="warn">⚠️ Retroplanning requis — preparation J-2 et J-1.</div>}
    </div>
  );
}
