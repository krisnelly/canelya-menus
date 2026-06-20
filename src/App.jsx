// ── APP PRINCIPALE ─────────────────────────────────────────────────────────────
// Ce fichier orchestre uniquement l'UI (état, navigation entre étapes/onglets).
// AUCUNE logique métier ici — tout passe par /logic. AUCUNE donnée statique
// ici — tout vient de /data. Si un comportement métier doit changer, il ne
// doit JAMAIS être modifié dans ce fichier.

import { useState, useEffect } from "react";
import { CSS } from "./components/styles";
import EtapeClient, { canNextEtapeClient } from "./components/EtapeClient";
import EtapePrestations, { canNextEtapePrestations } from "./components/EtapePrestations";
import EtapeLogistique from "./components/EtapeLogistique";
import EtapeEquipe from "./components/EtapeEquipe";
import Resultat from "./components/Resultat";
import Historique from "./components/Historique";
import { loadHistory, addEvent, updateEvent, deleteEvent } from "./logic/storage";
import { genererEvenement, regenererJour } from "./logic/genererEvenement";

const FORM0 = {
  clientId: "", clientAutre: "", nomEvenement: "", dateDebut: "", nombrePersonnes: 20,
  produitsAEcouler: "", ruptureStock: "",
  jours: [],
  pMatin: true,        hMatin: "09:00",
  pDej: true,          hDej: "12:00",
  pApm: false,         hApm: "15:00",
  pCocktailDej: false, hCocktailDej: "12:30",
  pCocktailDin: false, hCocktailDin: "18:00",
  alcool: false,
  typeEvenement: "Interne", distanceKm: 0, cuissonSurPlace: false, sensible: false,
  superviseurTerrain: "Muriel", superviseurCuisine: "Kris-Nelly", dresscode: "Wida 1",
};

const STEP_LABELS = ["Client", "Prestation", "Logistique", "Equipe"];

function copierPourWord(entry) {
  const txt = JSON.stringify(entry, null, 2);
  const fallbackCopy = () => {
    const ta = document.createElement("textarea");
    ta.value = txt;
    ta.style.cssText = "position:fixed;opacity:0";
    document.body.appendChild(ta);
    ta.focus();
    ta.select();
    try {
      document.execCommand("copy");
      alert("✅ Donnees copiees ! Collez dans le chat Claude en disant : genere les 5 documents Word.");
    } catch {
      alert("❌ Copie impossible.");
    }
    document.body.removeChild(ta);
  };
  if (navigator.clipboard) {
    navigator.clipboard.writeText(txt)
      .then(() => alert("✅ Donnees copiees ! Collez dans le chat Claude en disant : genere les 5 documents Word."))
      .catch(fallbackCopy);
  } else {
    fallbackCopy();
  }
}

export default function App() {
  const [tab, setTab] = useState("nouveau");
  const [step, setStep] = useState(0);
  const [form, setForm] = useState(FORM0);
  const [entry, setEntry] = useState(null);
  const [hist, setHist] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadHistory().then(h => { setHist(h); setLoading(false); });
  }, []);

  const upd = (k, v) => setForm(f => ({ ...f, [k]: v }));
  const togJ = j => upd("jours", form.jours.includes(j) ? form.jours.filter(x => x !== j) : [...form.jours, j]);

  const handleGenerer = async () => {
    const e = genererEvenement(form, hist);
    setHist([e, ...hist]);
    setEntry(e);
    setTab("resultat");
    setStep(0);
    await addEvent(e); // persistance MySQL en arrière-plan
  };

  const handleRegenJour = async jour => {
    const updated = regenererJour(entry, jour);
    setEntry(updated);
    setHist(hist.map(h => (h.id === entry.id ? updated : h)));
    await updateEvent(updated);
  };

  const handleSaveEdit = async (jour, pKey, field, value) => {
    const updated = {
      ...entry,
      menus: {
        ...entry.menus,
        [jour]: { ...entry.menus[jour], [pKey]: { ...entry.menus[jour]?.[pKey], [field]: value } },
      },
    };
    setEntry(updated);
    setHist(hist.map(h => (h.id === entry.id ? updated : h)));
    await updateEvent(updated);
  };

  const handleSupprimerHist = async id => {
    setHist(hist.filter(x => x.id !== id));
    await deleteEvent(id);
  };

  const canNext = [
    canNextEtapeClient(form),
    canNextEtapePrestations(form),
    true,
    true,
  ];

  const renderStep = () => {
    if (step === 0) return <EtapeClient form={form} upd={upd} />;
    if (step === 1) return <EtapePrestations form={form} upd={upd} togJ={togJ} />;
    if (step === 2) return <EtapeLogistique form={form} upd={upd} />;
    if (step === 3) return <EtapeEquipe form={form} upd={upd} />;
    return null;
  };

  return (
    <>
      <style>{CSS}</style>
      <div className="app">
        <div className="hdr">
          <div className="logo">🍽️</div>
          <div>
            <h1>La Maison de Canelya</h1>
            <p>Gestion des evenements traiteur</p>
          </div>
        </div>

        <div className="main">
          <div className="tabs">
            <button className={"tab" + (tab === "nouveau" ? " on" : "")} onClick={() => { setTab("nouveau"); setStep(0); }}>✨ Nouvel evenement</button>
            <button className={"tab" + (tab === "resultat" ? " on" : "")} onClick={() => setTab("resultat")} disabled={!entry}>📋 Resultat</button>
            <button className={"tab" + (tab === "hist" ? " on" : "")} onClick={() => setTab("hist")}>
              🕐 Historique{hist.length > 0 && <span className="bdg">{hist.length}</span>}
            </button>
          </div>

          {loading && <div className="empty">Chargement de l'historique...</div>}

          {!loading && tab === "nouveau" && (
            <>
              <div className="steps">
                {STEP_LABELS.map((l, i) => (
                  <div key={i} className={"step" + (i === step ? " on" : i < step ? " done" : "")} onClick={() => i < step && setStep(i)}>
                    <span className="step-num">{i < step ? "✓" : i + 1}</span>{l}
                  </div>
                ))}
              </div>
              {renderStep()}
              <div className="row-btns">
                {step > 0 && <button className="btn-n" onClick={() => setStep(s => s - 1)}>← Retour</button>}
                {step < 3 ? (
                  <button className="btn-g" style={{ width: "auto", padding: "11px 28px" }} onClick={() => setStep(s => s + 1)} disabled={!canNext[step]}>Suivant →</button>
                ) : (
                  <button className="btn-g" style={{ width: "auto", padding: "11px 28px" }} onClick={handleGenerer}>🎉 Generer</button>
                )}
              </div>
            </>
          )}

          {!loading && tab === "resultat" && (
            <Resultat
              entry={entry}
              onCopierWord={copierPourWord}
              onRegenJour={handleRegenJour}
              onSaveEdit={handleSaveEdit}
            />
          )}

          {!loading && tab === "hist" && (
            <Historique
              hist={hist}
              onVoir={h => { setEntry(h); setTab("resultat"); }}
              onCopierWord={copierPourWord}
              onSupprimer={handleSupprimerHist}
            />
          )}
        </div>
      </div>
    </>
  );
}
